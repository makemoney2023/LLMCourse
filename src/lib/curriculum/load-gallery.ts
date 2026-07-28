import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export type GalleryExample = {
  id: string;
  role: string;
  workflow: string;
  before: string;
  after: string;
  configured: string[];
  lesson: string;
};

export function loadCapstoneGallery(): GalleryExample[] {
  const filePath = path.join(
    process.cwd(),
    "curriculum",
    "gallery",
    "capstone-examples.yaml",
  );
  if (!fs.existsSync(filePath)) return [];
  const data = parseYaml(fs.readFileSync(filePath, "utf8")) as {
    examples?: GalleryExample[];
  };
  return data.examples ?? [];
}
