import { parse as parseYaml } from "yaml";
import { projectFileExists, readProjectText } from "@/lib/files/project-files";
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
  const filePath = `curriculum/modules/${meta.dirName}/demo.yaml`;
  if (!projectFileExists(filePath)) return null;
  const raw = readProjectText(filePath);
  if (!raw) return null;
  return parseYaml(raw) as ModuleDemo;
}
