#!/usr/bin/env node
/**
 * Fail the Cloudflare build if the Worker bundle does not contain curriculum.
 * vinext-cloudflare deploy rebuilds from the stub course-files.generated.ts
 * unless it is given an already-bundled dist and --skip-build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = path.join(root, "dist", "server");
const marker = "Sam started a new AI project";

function walk(dir, hits) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, hits);
      continue;
    }
    if (!entry.name.endsWith(".js")) continue;
    const text = fs.readFileSync(abs, "utf8");
    if (text.includes(marker)) hits.push(path.relative(root, abs));
  }
}

const hits = [];
walk(serverDir, hits);
if (hits.length === 0) {
  console.error(
    "Cloudflare build is missing curriculum text in dist/server.",
  );
  console.error(
    "Run npm run build:vinext. Do not let vinext-cloudflare deploy rebuild from the empty course-files stub.",
  );
  process.exit(1);
}
console.log(`Curriculum is in the Worker bundle (${hits.length} file).`);
