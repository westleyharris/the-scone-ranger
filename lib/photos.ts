import { readdirSync } from "node:fs";
import path from "node:path";
import type { FlavorPhotos } from "@/lib/photo-types";

export type { FlavorPhoto, FlavorPhotos } from "@/lib/photo-types";

/**
 * Flavor pictures live in public/images/flavors/{slug}-cutout.png.
 * Only transparent single-scone cut-outs are shown; tray/multi photos are omitted.
 * Server only (reads the filesystem).
 */
/** Cut-outs that live outside the flavors folder (e.g. the hero scone). */
const cutoutAliases: Record<string, string> = {
  "orange-cranberry": "/images/hero-orange-cranberry-cutout.png",
};

export function flavorPhotos(): FlavorPhotos {
  const dir = path.join(process.cwd(), "public", "images", "flavors");
  try {
    const photos: FlavorPhotos = {};
    for (const file of readdirSync(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (ext !== ".png") continue;
      const base = path.basename(file, ext);
      const slug = base.endsWith("-cutout") ? base.slice(0, -"-cutout".length) : base;
      photos[slug] = { src: `/images/flavors/${file}`, cutout: true };
    }
    for (const [slug, src] of Object.entries(cutoutAliases)) {
      if (!photos[slug]) {
        photos[slug] = { src, cutout: true };
      }
    }
    return photos;
  } catch {
    return {};
  }
}
