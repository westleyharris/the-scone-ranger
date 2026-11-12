const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function Stitch({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`stitch ${className}`} />;
}

export function Wheat({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22V9" />
      <path d="M12 18c-2.4-.4-4-1.8-4.4-3.8 2 .2 3.4 1 4.4 2.4" />
      <path d="M12 18c2.4-.4 4-1.8 4.4-3.8-2 .2-3.4 1-4.4 2.4" />
      <path d="M12 14.2c-2.1-.3-3.4-1.5-3.8-3.2 1.7.2 2.9.9 3.8 2" />
      <path d="M12 14.2c2.1-.3 3.4-1.5 3.8-3.2-1.7.2-2.9.9-3.8 2" />
      <path d="M12 10.8c-1.7-.2-2.8-1.2-3-2.6 1.4.15 2.3.7 3 1.6" />
      <path d="M12 10.8c1.7-.2 2.8-1.2 3-2.6-1.4.15-2.3.7-3 1.6" />
      <path d="M10.4 6.8C10.9 5.4 11.4 4.4 12 3.6c.6.8 1.1 1.8 1.6 3.2" />
    </svg>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-bark uppercase">
      <Wheat className="h-8 w-8 text-ranger" />
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
