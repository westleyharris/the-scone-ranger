import { flavorSlug } from "@/lib/content";

export type FlavorPhoto = {
  src: string;
  /** Transparent cut-out of a single scone (png). Shown on a plate instead of cropped. */
  cutout: boolean;
};

export type FlavorPhotos = Record<string, FlavorPhoto>;

export function flavorPhotoFor(photos: FlavorPhotos, name: string): FlavorPhoto | undefined {
  return photos[flavorSlug(name)];
}
