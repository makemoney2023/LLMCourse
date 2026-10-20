#!/usr/bin/env node
/**
 * Writes curriculum into src/lib/files/course-files.generated.ts for one
 * command, then restores the stub. The Cloudflare Worker has no repo
 * filesystem, so the server bundle has to carry these files.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "src/lib/files/course-files.generated.ts");
const stub =
  "/** Stub. `scripts/with-curriculum-bundle.mjs` fills this during the Cloudflare build. */\n" +
  "export const bundledCourseFiles: Record<string, string> | null = null;\n";

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, files);
      continue;
    }
    const key = path.relative(root, abs).split(path.sep).join("/");
    files[key] = fs.readFileSync(abs, "utf8");
  }
}

function writeBundle() {
  const files = {};
  walk(path.join(root, "curriculum"), files);
  const body =
    "/** Generated for the Cloudflare server bundle. Do not commit the filled file. */\n" +
    `export const bundledCourseFiles: Record<string, string> | null = ${JSON.stringify(files)};\n`;
  fs.writeFileSync(outFile, body);
}

function restore() {
  fs.writeFileSync(outFile, stub);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/with-curriculum-bundle.mjs <command> [args...]");
  process.exit(1);
}

writeBundle();
let restored = false;
const cleanup = () => {
  if (restored) return;
  restored = true;
  restore();
};
process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanup();
  process.exit(143);
});

const child = spawn(args[0], args.slice(1), {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code, signal) => {
  cleanup();
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
