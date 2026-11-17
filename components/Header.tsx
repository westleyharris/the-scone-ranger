"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { nav, site } from "@/lib/content";
import { BrandMark } from "@/components/BrandMark";
import { useOrder } from "@/components/OrderProvider";

/** Same order as the menu and footer; the seal sits between the two pairs. */
const leftNav = nav.slice(0, 2);
const rightNav = nav.slice(2);

function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page has moved off the top; only adds the bar's shadow. */
function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
}

export function Header() {
  const pathname = usePathname();
  const { lines, setOpen } = useOrder();
  const ready = useClientReady();
  const scrolled = useScrolled();
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
    <header className="site-header" data-scrolled={scrolled ? "" : undefined}>
      <div className="site-bar">
        <div className="site-bar-inner">
          <div className="flex items-center">
            <button
              type="button"
              className="site-burger inline-flex lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenu({ open: !menuOpen, path: pathname })}
            >
              <MenuMark open={menuOpen} />
            </button>
            <a className="site-call hidden lg:inline-flex" href={site.phoneHref}>
              <span className="site-call-icon" aria-hidden="true">
                <PhoneMark />
              </span>
              <span className="site-call-text">
                <span className="site-call-label">Call or text</span>
                <span className="site-call-number">{site.phoneDisplay}</span>
              </span>
            </a>
          </div>

          <nav className="grid grid-cols-[1fr_auto_1fr] items-center" aria-label="Primary">
            <ul className="hidden items-center justify-end gap-8 lg:flex xl:gap-10">
              {leftNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} active={pathname === item.href} />
                </li>
              ))}
            </ul>
            <Link href="/" aria-label={site.name} className="site-seal-slot">
              <Seal />
            </Link>
            <ul className="hidden items-center gap-8 lg:flex xl:gap-10">
              {rightNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} active={pathname === item.href} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end">
            <OrderButton count={count} onClick={openOrder} />
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div id="site-menu" className="site-menu absolute inset-x-0 top-full lg:hidden">
          <button
            type="button"
            className="site-menu-veil absolute inset-x-0 top-0 h-[100dvh] w-full bg-ink/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div className="site-menu-sheet relative bg-paper shadow-[0_24px_50px_rgba(42,33,28,0.22)]">
            <nav className="mx-auto flex max-w-6xl flex-col px-5 pt-3" aria-label="Menu">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className="site-menu-link"
                  >
                    {item.label}
                    {active ? <StarMark /> : <ArrowMark />}
                  </Link>
                );
              })}
            </nav>
            <div className="mx-auto flex max-w-6xl flex-col px-5 pt-6 pb-7">
              <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-bark uppercase">Call or text</p>
              <a className="mt-1.5 font-display text-2xl leading-none text-ink" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
              <a className="mt-3 text-sm text-bark" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-bark uppercase">{site.place}</p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/**
 * Stand-in for the Suspense boundary around <Header />: the bar and the seal,
 * so nothing shifts or pops in when the real header streams in.
 */
export function HeaderFallback() {
  return (
    <div className="site-header" aria-hidden="true">
      <div className="site-bar">
        <div className="site-bar-inner">
          <span className="site-seal-slot">
            <Seal />
          </span>
        </div>
      </div>
    </div>
  );
}

/** The logo on a paper plate. It always hangs over the bar's bottom edge. */
function Seal() {
  return (
    <span className="site-seal">
      <BrandMark className="h-full w-full" sizes="112px" eager />
    </span>
  );
}

function OrderButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-solid btn-sm site-order">
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
        className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-current transition-transform duration-200 ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-current transition-transform duration-200 ${
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
    <Link href={href} aria-current={active ? "page" : undefined} className="site-nav-link">
      {label}
    </Link>
  );
}

function PhoneMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4">
      <path
        d="M6.6 3.2 4.7 3.5c-.8.1-1.4.8-1.3 1.6.6 6 5.5 10.9 11.5 11.5.8.1 1.5-.5 1.6-1.3l.3-1.9a1 1 0 0 0-.6-1.1l-2.6-1.1a1 1 0 0 0-1.1.2l-1 1a8.3 8.3 0 0 1-4-4l1-1a1 1 0 0 0 .2-1.1L7.7 3.8a1 1 0 0 0-1.1-.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Marks the page you are on in the phone menu; the same star as the poster. */
function StarMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-[#a8803f]">
      <path
        d="M10 1.5l2.47 5.4 5.9.66-4.38 4 1.2 5.8L10 14.4l-5.19 2.96 1.2-5.8-4.38-4 5.9-.66L10 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 text-bark/45">
      <path
        d="M4 10h11M11 5.5l4.5 4.5-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
