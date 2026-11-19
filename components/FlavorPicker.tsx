"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { featured, flavorNames } from "@/lib/content";
import { MIN_SCONES } from "@/lib/order";
import { useOrder } from "@/components/OrderProvider";

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Word starts first ("lem" → Lemon…), then anything containing the text. */
function search(query: string) {
  const needle = fold(query.trim());
  if (!needle) return [...flavorNames];
  const starts = flavorNames.filter((name) => fold(name).split(/[\s’']+/).some((word) => word.startsWith(needle)));
  const contains = flavorNames.filter((name) => !starts.includes(name) && fold(name).includes(needle));
  return [...starts, ...contains];
}

/**
 * Lets people build an order without leaving the slip: type to find a
 * flavor, Enter or tap to add six. Follows the ARIA combobox pattern.
 */
export function FlavorPicker({ showQuickAdd = false }: { showQuickAdd?: boolean }) {
  const { lines, addFlavor } = useOrder();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const listId = `${id}-flavors`;
  const matches = useMemo(() => search(query), [query]);
  const onSlip = new Map<string, number>();
  for (const line of lines) onSlip.set(line.name, (onSlip.get(line.name) ?? 0) + line.scones);
  const expanded = open && matches.length > 0;

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (expanded) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, expanded, id]);

  function add(name: string) {
    addFlavor(name, { reveal: false });
    const total = (onSlip.get(name) ?? 0) + MIN_SCONES;
    setAnnouncement(`Added ${name}. ${total} on the slip.`);
    setQuery("");
    setActive(0);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      else setActive((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      if (expanded && matches[active]) {
        event.preventDefault();
        add(matches[active]);
      }
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  }

  const quickAdd = featured.filter((name) => !onSlip.has(name));

  return (
    <div>
      <label htmlFor={`${id}-input`} className="block text-sm font-semibold text-ink">
        Add a flavor
      </label>
      <div className="relative mt-1.5">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-bark/70">
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          enterKeyHint="done"
          placeholder={`Search ${flavorNames.length} flavors`}
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded ? `${id}-option-${active}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="flavor-picker-input"
        />
        {expanded ? (
          <ul id={listId} role="listbox" aria-label="Flavors" className="flavor-picker-list">
            {matches.map((name, index) => {
              const count = onSlip.get(name);
              return (
                <li
                  key={name}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className="flavor-picker-option"
                  // Keep focus in the input so the list doesn't close before the click lands.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => add(name)}
                >
                  <span className="min-w-0 truncate">{name}</span>
                  <span className="flavor-picker-hint">{count ? `${count} on slip · +${MIN_SCONES}` : `+${MIN_SCONES}`}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
        {open && matches.length === 0 ? (
          <p className="flavor-picker-empty">No flavor matches “{query.trim()}”. Ask about it in the note below.</p>
        ) : null}
      </div>

      {showQuickAdd && quickAdd.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-[0.16em] text-bark uppercase">Quick add</span>
          {quickAdd.map((name) => (
            <button key={name} type="button" onClick={() => add(name)} className="flavor-chip">
              {name}
              <span aria-hidden="true">+</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
