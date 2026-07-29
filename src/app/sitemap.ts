import type { MetadataRoute } from "next";
import {
  listModules,
  listWorkshopSessions,
} from "@/lib/curriculum/load-curriculum";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const staticPaths = [
    "",
    "/modules",
    "/workshops",
    "/glossary",
    "/flashcards",
    "/resources",
    "/gallery",
    "/capstone",
    "/review",
    "/certificates",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...listModules().map((mod) => ({
      url: `${base}/modules/${mod.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...listWorkshopSessions().map((session) => ({
      url: `${base}/workshops/${session.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
