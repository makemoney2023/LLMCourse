import { parse as parseYaml } from "yaml";
import { readProjectText } from "@/lib/files/project-files";

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
  const raw = readProjectText("curriculum/gallery/capstone-examples.yaml");
  if (!raw) return [];
  const data = parseYaml(raw) as {
    examples?: GalleryExample[];
  };
  return data.examples ?? [];
}
