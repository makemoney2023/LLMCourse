import path from "node:path";
import { fileURLToPath } from "node:url";
import { publishBatch } from "../publish/youtube";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, "../..");

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(argv: string[]) {
  let batchDir: string | undefined;
  let startDate = todayIsoDate();
  let dryRun = true;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if ((arg === "--batch" || arg === "--batch-dir") && argv[i + 1]) {
      batchDir = path.resolve(argv[++i]!);
      continue;
    }
    if ((arg === "--start-date" || arg === "--startDate") && argv[i + 1]) {
      startDate = argv[++i]!;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--live") {
      dryRun = false;
      continue;
    }
  }

  if (!batchDir) {
    throw new Error(
      "Missing --batch <dir> (e.g. content-studio/out/batch-2026-08-12)",
    );
  }

  return { batchDir, startDate, dryRun };
}

async function main() {
  const { batchDir, startDate, dryRun } = parseArgs(process.argv.slice(2));
  const resolvedBatch = path.isAbsolute(batchDir)
    ? batchDir
    : path.resolve(studioRoot, batchDir);

  const result = await publishBatch(resolvedBatch, { dryRun, startDate });

  console.log(
    dryRun
      ? `Dry-run publish plan: ${result.planPath}`
      : `Uploaded ${result.uploaded?.length ?? 0} Shorts (scheduled)`,
  );
  console.log(`planned: ${result.planned.map((p) => p.id).join(", ")}`);
  if (result.skipped.length > 0) {
    console.log(`skipped (unapproved): ${result.skipped.join(", ")}`);
  }
  for (const item of result.planned) {
    const uploaded = result.uploaded?.find((u) => u.id === item.id);
    const suffix = uploaded ? ` → ${uploaded.videoId}` : "";
    console.log(`  - ${item.id} @ ${item.publishAt}${suffix}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
