const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function Stitch({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`stitch ${className}`} />;
}

/**
 * The Scone Ranger's mask, untied: solid, eyes cut out, ties hanging loose.
 * The viewBox is nudged down so the mask and ties sit centred in the box.
 */
export function Mask({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 2.4 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.6 9.4C4.6 7.8 8.8 7.2 12 8.9c3.2-1.7 7.4-1.1 9.4.5-.2 3-1.8 5.2-4.2 5.2-2 0-3.8-1-5.2-2.2-1.4 1.2-3.2 2.2-5.2 2.2-2.4 0-4-2.2-4.2-5.2ZM5.9 11c1.1-1.3 3.4-1.4 4.4-.2-1.1 1.3-3.3 1.4-4.4.2ZM18.1 11c-1.1-1.3-3.4-1.4-4.4-.2 1.1 1.3 3.3 1.4 4.4.2Z"
      />
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M2.9 9.9C1.4 11.6 1.6 13.8 2.6 15.6s.6 3.8-.8 5.2" />
        <path d="M21.1 9.9c1.3 1.9 1.1 4.1.1 5.9-.8 1.6-.4 3.8.8 5.4" />
      </g>
    </svg>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-bark uppercase">
      <Mask className="h-8 w-8 text-ranger" />
      {children}
    </p>
  );
}

export function DayStamp({ day, tilt = -8 }: { day: number; tilt?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative grid h-14 w-14 shrink-0 place-items-center text-ranger"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full text-rope">
        <circle cx="28" cy="28" r="25" fill="#fbf6ee" />
        <circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1.6 4.4"
          strokeLinecap="round"
        />
        <circle cx="28" cy="28" r="18.5" fill="none" stroke="#3a2a24" strokeOpacity="0.28" strokeWidth="0.75" />
      </svg>
      <span className="relative font-display text-[13px] tracking-[0.04em]">{days[day]}</span>
    </span>
  );
}
