"use client";

import { useState, useEffect } from "react";
import styles from "./ProductFilter.module.css";

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "tools", label: "Tools" },
  { key: "skincare", label: "Skincare" },
  { key: "kits", label: "Kits" },
] as const;

type Filter = typeof FILTERS[number]["key"];

export function ProductFilter() {
  const [active, setActive] = useState<Filter>("all");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-cat]");
    sections.forEach((s) => {
      const cat = s.dataset.cat;
      s.style.display = active === "all" || cat === active ? "" : "none";
    });
    if (active !== "all") {
      const target = document.getElementById(active);
      if (target) {
        // wait one frame so layout settles before scrolling
        requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    }
  }, [active]);

  return (
    <section className={styles.wrap} aria-label="Shop filter">
      <div className="container">
        <div className={styles.inner} role="tablist">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.btn} ${active === f.key ? styles.active : ""}`}
              onClick={() => setActive(f.key)}
              role="tab"
              aria-selected={active === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
