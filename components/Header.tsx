"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { nav, site } from "@/lib/content";
import { BrandMark } from "@/components/BrandMark";
import { useOrder } from "@/components/OrderProvider";

const leftNav = [nav[0], nav[2]];
const rightNav = [nav[1], nav[3]];

function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Header() {
  const pathname = usePathname();
  const { lines, setOpen } = useOrder();
  const ready = useClientReady();
  const count = ready ? lines.length : 0;
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu({ open: false, path: pathname });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, pathname]);

  function closeMenu() {
    setMenu({ open: false, path: pathname });
  }

  function openOrder() {
    closeMenu();
    setOpen(true);
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="relative flex h-24 items-center justify-between px-3 lg:hidden">
          <button
            type="button"
            className="relative z-20 inline-flex h-11 w-11 items-center justify-center rounded-full text-ranger hover:bg-foam"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenu({ open: !menuOpen, path: pathname })}
          >
            <MenuMark open={menuOpen} />
          </button>
          <Link
            href="/"
            aria-label={site.name}
            className="absolute top-1 left-1/2 z-10 -translate-x-1/2"
          >
            <span className="block rounded-full bg-cream p-1.5 shadow-[0_12px_28px_rgba(42,33,28,0.16)]">
              <BrandMark className="h-[6.75rem] w-[6.75rem]" />
            </span>
          </Link>
          <OrderButton count={count} onClick={openOrder} />
        </div>

        <div className="hidden items-center px-8 pt-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div />
          <nav className="flex items-center gap-8" aria-label="Primary">
            {leftNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={pathname === item.href} />
            ))}
            <Link href="/" aria-label={site.name} className="relative z-10 -mb-12 mx-3">
              <span className="block rounded-full bg-cream p-1.5 shadow-[0_12px_28px_rgba(42,33,28,0.16)]">
                <BrandMark className="h-24 w-24" />
              </span>
            </Link>
            {rightNav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={pathname === item.href} />
            ))}
          </nav>
          <div className="flex justify-end pb-1">
            <OrderButton count={count} onClick={openOrder} />
          </div>
        </div>
      </div>

      <div className="relative z-0 h-[3px] bg-line" />
      <div className="relative z-0 mt-1.5 h-[3px] bg-line" />

      {menuOpen ? (
        <div id="site-menu" className="absolute inset-x-0 top-full z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-x-0 top-0 h-[100dvh] w-full bg-ink/30"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div className="relative z-10 border-t border-line bg-paper shadow-[0_24px_50px_rgba(42,33,28,0.16)]">
            <nav className="mx-auto flex max-w-6xl flex-col px-6 py-2" aria-label="Menu">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`border-b border-line py-4 font-display text-[1.85rem] leading-none ${
                      active ? "text-ranger" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-5 text-sm">
              <a className="font-semibold text-ink" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
              <a className="text-bark" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <p className="pt-2 text-xs font-semibold tracking-[0.18em] text-bark uppercase">{site.place}</p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function OrderButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-solid btn-sm relative z-20"
    >
      Order
      {count > 0 ? (
        <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-paper px-1.5 text-xs font-bold text-ranger">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function MenuMark({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-6" aria-hidden="true">
      <span
        className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-ranger transition-transform duration-200 ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-ranger transition-opacity duration-200 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-ranger transition-transform duration-200 ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`text-[0.95rem] font-semibold tracking-wide ${
        active ? "text-ranger underline decoration-2 underline-offset-[10px]" : "text-ink hover:text-ranger"
      }`}
    >
      {label}
    </Link>
  );
}
