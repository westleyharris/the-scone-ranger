import { readdirSync } from "node:fs";
import path from "node:path";

const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export function flavorPhotoSlugs() {
  const dir = path.join(process.cwd(), "public", "images", "flavors");
  try {
    return readdirSync(dir)
      .filter((file) => extensions.has(path.extname(file).toLowerCase()))
      .map((file) => path.basename(file, path.extname(file)));
  } catch {
    return [];
  }
}
