"use client";

import { useId, useState } from "react";
import styles from "./FAQAccordion.module.css";

export type FAQ = { q: string; a: string };

type Props = {
  heading?: string;
  sideText?: string;
  showContact?: boolean;
  items: FAQ[];
};

export function FAQAccordion({
  heading = "FAQs",
  sideText = "If your question is not answered here, the studio number is below. We respond inside one working day.",
  showContact = true,
  items,
}: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const idBase = useId();

  return (
    <section className={`${styles.wrap} section`}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.side}>
            <h2>{heading}</h2>
            <p className={styles.sideText}>{sideText}</p>
            {showContact && (
              <div className={styles.contact}>
                <a href="tel:+442039513429">+44 20 3951 3429</a>
                <a href="mailto:team@thewellnesslondon.com">team@thewellnesslondon.com</a>
              </div>
            )}
          </div>
          <ul className={styles.list}>
            {items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${idBase}-panel-${i}`;
              const buttonId = `${idBase}-btn-${i}`;
              return (
                <li key={i} className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className={styles.q}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className={styles.plus} aria-hidden>+</span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={styles.a}
                  >
                    {item.a}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
