import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scriptPackToTitlePunchProps } from "../render/props";
import { loadScriptPackFile } from "../write/build-script";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, "../..");

const DEFAULT_COMPOSITION = "TitlePunch";
const DEFAULT_OUT = "out/golden/mental-model-desk-space-01.mp4";
const GOLDEN_FIXTURE = path.join(
  studioRoot,
  "fixtures/mental-model-desk-space-01.yaml",
);

function parseArgs(argv: string[]) {
  const positional = argv.filter((arg) => !arg.startsWith("-"));
  const compositionId = positional[0] ?? DEFAULT_COMPOSITION;
  const outputRel = positional[1] ?? DEFAULT_OUT;
  return { compositionId, outputRel };
}

function main() {
  const { compositionId, outputRel } = parseArgs(process.argv.slice(2));
  const outputPath = path.resolve(studioRoot, outputRel);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const pack = loadScriptPackFile(GOLDEN_FIXTURE);
  const props = scriptPackToTitlePunchProps(pack);
  const propsPath = path.join(path.dirname(outputPath), "title-punch-props.json");
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2), "utf8");

  const entry = path.join(studioRoot, "src/remotion/index.ts");
  const result = spawnSync(
    "npx",
    [
      "remotion",
      "render",
      entry,
      compositionId,
      outputPath,
      `--props=${propsPath}`,
    ],
    {
      cwd: studioRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  if (!fs.existsSync(outputPath)) {
    console.error(`Render finished but output missing: ${outputPath}`);
    process.exit(1);
  }

  console.log(`Rendered ${outputPath}`);
}

main();
