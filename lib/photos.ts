import { readdirSync } from "node:fs";
import path from "node:path";
import type { FlavorPhotos } from "@/lib/photo-types";

export type { FlavorPhoto, FlavorPhotos } from "@/lib/photo-types";

const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Flavor pictures live in public/images/flavors/{slug}.{ext}.
 * A .png is treated as a transparent cut-out of one scone; anything else is a photograph.
 * Server only (reads the filesystem).
 */
/** Cut-outs that live outside the flavors folder (e.g. the hero scone). */
const cutoutAliases: Record<string, string> = {
  "orange-cranberry": "/images/hero-orange-cranberry.png",
};

export function flavorPhotos(): FlavorPhotos {
  const dir = path.join(process.cwd(), "public", "images", "flavors");
  try {
    const photos: FlavorPhotos = {};
    for (const file of readdirSync(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (!extensions.has(ext)) continue;
      const slug = path.basename(file, ext);
      const cutout = ext === ".png";
      // Prefer the cut-out when both exist.
      if (photos[slug] && !cutout) continue;
      photos[slug] = { src: `/images/flavors/${file}`, cutout };
    }
    for (const [slug, src] of Object.entries(cutoutAliases)) {
      if (!photos[slug]?.cutout) {
        photos[slug] = { src, cutout: true };
      }
    }
    return photos;
  } catch {
    return {};
  }
}
