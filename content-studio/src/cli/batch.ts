import path from "node:path";
import { fileURLToPath } from "node:url";
import { runBatch } from "../batch/run-batch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(studioRoot, "..");

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(argv: string[]) {
  let date = todayIsoDate();
  let count = 7;
  let curriculumRoot = path.join(repoRoot, "curriculum");

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--date" && argv[i + 1]) {
      date = argv[++i]!;
      continue;
    }
    if (arg === "--count" && argv[i + 1]) {
      count = Number(argv[++i]);
      continue;
    }
    if (arg === "--curriculum" && argv[i + 1]) {
      curriculumRoot = path.resolve(argv[++i]!);
      continue;
    }
  }

  return { date, count, curriculumRoot };
}

function main() {
  const { date, count, curriculumRoot } = parseArgs(process.argv.slice(2));
  const result = runBatch({ date, count, curriculumRoot });

  console.log(`Batch written to ${result.dir}`);
  console.log(`ids: ${result.ids.join(", ")}`);
  if (result.errors.length > 0) {
    console.error(`errors (${result.errors.length}):`);
    for (const entry of result.errors) {
      console.error(`  - ${entry.id}: ${entry.error}`);
    }
  } else {
    console.log("errors: none");
  }
  console.log("Review APPROVAL.md and set approve: true in approval.yaml before publish.");
}

main();
