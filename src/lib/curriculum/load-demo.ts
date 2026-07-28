import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { getModuleBySlug } from "./load-curriculum";

export type ModuleDemo = {
  title: string;
  captionBefore: string;
  captionAfter: string;
  beforeImage: string;
  afterImage: string;
  altBefore: string;
  altAfter: string;
};

export function loadModuleDemo(slug: string): ModuleDemo | null {
  const meta = getModuleBySlug(slug);
  if (!meta) return null;
  const filePath = path.join(
    process.cwd(),
    "curriculum",
    "modules",
    meta.dirName,
    "demo.yaml",
  );
  if (!fs.existsSync(filePath)) return null;
  return parseYaml(fs.readFileSync(filePath, "utf8")) as ModuleDemo;
}
