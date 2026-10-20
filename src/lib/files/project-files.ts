import fs from "node:fs";
import path from "node:path";
import { bundledCourseFiles } from "./course-files.generated";

/**
 * Curriculum text bundled into the Cloudflare server build.
 * Node, Vitest, and `next start` keep the stub null and read the working tree.
 */
const BUNDLED_FILES: Record<string, string> | null = bundledCourseFiles;

function normalize(relativePath: string): string {
  return relativePath.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
}

function projectPath(relativePath: string): string {
  return path.join(/* turbopackIgnore: true */ process.cwd(), relativePath);
}

export function readProjectText(relativePath: string): string | null {
  const key = normalize(relativePath);
  if (BUNDLED_FILES) {
    return Object.prototype.hasOwnProperty.call(BUNDLED_FILES, key)
      ? BUNDLED_FILES[key]
      : null;
  }
  const abs = projectPath(key);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

export function readProjectBytes(relativePath: string): Uint8Array | null {
  const text = readProjectText(relativePath);
  if (text != null) return new TextEncoder().encode(text);
  if (BUNDLED_FILES) return null;
  const abs = projectPath(normalize(relativePath));
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs);
}

export function projectFileExists(relativePath: string): boolean {
  const key = normalize(relativePath);
  if (BUNDLED_FILES) {
    return Object.prototype.hasOwnProperty.call(BUNDLED_FILES, key);
  }
  return fs.existsSync(path.join(process.cwd(), key));
}

export function listProjectEntries(
  relativeDir: string,
): { name: string; isDirectory: boolean }[] {
  const dir = normalize(relativeDir);
  if (BUNDLED_FILES) {
    const prefix = `${dir}/`;
    const dirs = new Set<string>();
    const files = new Set<string>();
    for (const key of Object.keys(BUNDLED_FILES)) {
      if (!key.startsWith(prefix)) continue;
      const rest = key.slice(prefix.length);
      const slash = rest.indexOf("/");
      if (slash === -1) files.add(rest);
      else dirs.add(rest.slice(0, slash));
    }
    return [
      ...[...dirs].map((name) => ({ name, isDirectory: true })),
      ...[...files].map((name) => ({ name, isDirectory: false })),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }
  const abs = path.join(process.cwd(), dir);
  if (!fs.existsSync(abs)) return [];
    return fs.readdirSync(abs, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
  }));
}
