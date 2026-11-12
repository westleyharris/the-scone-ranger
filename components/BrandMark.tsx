export function BrandMark({
  className = "h-11 w-11",
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-mark.png"
      alt={alt}
      className={`rounded-full object-cover ${className}`}
    />
  );
}
