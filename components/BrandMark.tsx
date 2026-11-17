import Image from "next/image";

export function BrandMark({
  className = "h-11 w-11",
  alt = "",
  sizes = "96px",
  eager = false,
}: {
  className?: string;
  alt?: string;
  /** Rendered width, so the 512px source is served at a sensible size. */
  sizes?: string;
  /** Load straight away; for the header badge, which is always on screen. */
  eager?: boolean;
}) {
  return (
    <Image
      src="/logo-mark.png"
      alt={alt}
      width={512}
      height={512}
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
