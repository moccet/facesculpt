"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { search, type SearchEntry } from "@/lib/search-index";
import styles from "./SearchModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

const DEBOUNCE_MS = 60;

/**
 * Native <dialog> based search modal. The <dialog> element gives focus
 * trap, inert background, and ESC-to-close for free; we only need to
 * wire up the open/close calls and the click-outside-to-close behaviour.
 */
export function SearchModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [rawQuery, setRawQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  // Open / close the native dialog when the prop flips.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Reset query each time the modal opens so it always feels fresh.
      setRawQuery("");
      setDebounced("");
      setActiveIdx(0);
      // Slight delay so the autofocus lands after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Bridge the dialog's native close (ESC, .close()) back into React state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      e.preventDefault();
      onClose();
    }
    function onClosed() {
      onClose();
    }
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClosed);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClosed);
    };
  }, [onClose]);

  // Debounce the search query so we don't recompute on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(rawQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const results = useMemo<SearchEntry[]>(() => search(debounced), [debounced]);

  // Reset the active index when results change so we don't point past the end.
  useEffect(() => {
    setActiveIdx(0);
  }, [results.length]);

  function pick(entry: SearchEntry) {
    onClose();
    router.push(entry.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const entry = results[activeIdx];
      if (entry) pick(entry);
    }
  }

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    // Click outside the inner content (i.e. on the backdrop area inside the
    // dialog box's bounding rect — actually the dialog itself when nothing
    // intercepted it) closes the modal.
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Search FaceSculpt"
      onClick={onDialogClick}
      onKeyDown={onKeyDown}
    >
      <div className={styles.head}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search workouts, products, FAQ…"
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search query"
          aria-controls="search-results"
        />
        <span className={styles.kbd}>ESC</span>
      </div>

      {debounced.trim().length === 0 ? (
        <div className={styles.empty}>
          Start typing to search the studio. Workouts, boosters, products, FAQ.
        </div>
      ) : results.length === 0 ? (
        <div className={styles.empty}>
          Nothing matches “{debounced.trim()}”.
        </div>
      ) : (
        <ul id="search-results" className={styles.list} role="listbox">
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === activeIdx}>
              <button
                type="button"
                className={`${styles.item} ${i === activeIdx ? styles.itemActive : ""}`}
                onClick={() => pick(r)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <span className={styles.cat}>{r.category}</span>
                <span>
                  <span className={styles.title}>{r.title}</span>
                  {r.subtitle && <span className={styles.sub}> · {r.subtitle}</span>}
                </span>
                <svg className={styles.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7h8M7 3l4 4-4 4" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.foot}>
        <span><kbd>↑↓</kbd> navigate</span>
        <span><kbd>↵</kbd> open</span>
        <span><kbd>ESC</kbd> close</span>
      </div>
    </dialog>
  );
}
