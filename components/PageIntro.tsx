import { Eyebrow, Stitch } from "@/components/Marks";

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 font-display text-[2.75rem] leading-[0.96] tracking-tight text-ink sm:text-6xl">
        {title}
      </h1>
      <Stitch className="mt-5 w-28 text-rope" />
      {children ? <div className="mt-5 max-w-2xl space-y-3 text-lg leading-8 text-bark">{children}</div> : null}
    </header>
  );
}
