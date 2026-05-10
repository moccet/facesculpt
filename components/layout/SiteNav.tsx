"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { SearchModal } from "./SearchModal";
import { AccountModal } from "./AccountModal";
import { useCart } from "@/lib/cart";
import styles from "./SiteNav.module.css";

const NAV_LINKS = [
  { href: "/workouts", label: "Workouts" },
  { href: "/shop", label: "Shop" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { count, hydrated, open: openCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      // Cmd/Ctrl + K opens search — industry-standard shortcut.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  // Render the badge only after hydration so server/client output match.
  const badgeCount = hydrated && count > 0 ? count : null;

  return (
    <>
      <nav className={styles.nav} aria-label="Primary">
        <div className={styles.row}>
          <div className={styles.left}>
            <button
              type="button"
              className={styles.menuToggle}
              aria-label="Open menu"
              aria-controls="mobileMenu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <span /><span /><span />
            </button>
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.link} ${isActive(l.href) ? styles.linkActive : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <Wordmark />
          <div className={styles.right}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label="Account"
              onClick={() => setAccountOpen(true)}
            >
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={badgeCount ? `Bag, ${badgeCount} items` : "Bag"}
              onClick={openCart}
              data-count={badgeCount ?? undefined}
            >
              <svg viewBox="0 0 24 24"><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
              {badgeCount && <span className={styles.badge} aria-hidden>{badgeCount}</span>}
            </button>
            <Link href="/workouts#book" className={styles.cta}>Book</Link>
          </div>
        </div>
      </nav>

      <div
        id="mobileMenu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.mobileTop}>
          <Wordmark asLink={false} />
          <button
            type="button"
            className={styles.mobileClose}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className={styles.mobileList} aria-label="Mobile primary">
          <Link href="/">Home</Link>
          <Link href="/workouts">Workouts</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/membership">Membership</Link>
          <Link href="/about">About</Link>
          <Link href="/assessment">Take the assessment</Link>
        </nav>
        <Link href="/workouts#book" className={styles.mobileCta}>
          Book a workout
        </Link>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
}
