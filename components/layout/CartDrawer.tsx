"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQty, remove } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      e.preventDefault();
      close();
    }
    function onClosed() {
      close();
    }
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClosed);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClosed);
    };
  }, [close]);

  async function checkout() {
    if (submitting || lines.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout — try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — try again.");
      setSubmitting(false);
    }
  }

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Cart"
      onClick={onDialogClick}
    >
      <div className={styles.head}>
        <h2 className={styles.title}>
          Your bag {lines.length > 0 && `(${lines.reduce((s, l) => s + l.quantity, 0)})`}
        </h2>
        <button
          type="button"
          className={styles.close}
          aria-label="Close cart"
          onClick={close}
        >
          ×
        </button>
      </div>

      <div className={styles.body}>
        {lines.length === 0 ? (
          <div className={styles.empty}>
            Your bag is empty.<br />
            <Link href="/shop" onClick={close} style={{ textDecoration: "underline", marginTop: 12, display: "inline-block" }}>
              Browse the shop
            </Link>
          </div>
        ) : (
          <ul className={styles.list}>
            {lines.map((line) => {
              const lineTotal = line.product.price * line.quantity;
              return (
                <li key={line.slug} className={styles.line}>
                  <div className={styles.thumb}>
                    {line.product.flag && (
                      <span className={styles.flag}>{line.product.flag}</span>
                    )}
                  </div>
                  <div className={styles.lineMain}>
                    <span className={styles.lineName}>{line.product.name}</span>
                    <span className={styles.lineMeta}>{line.product.meta}</span>
                    <div
                      className={styles.qty}
                      role="group"
                      aria-label={`Quantity for ${line.product.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQty(line.slug, line.quantity + 1)}
                        disabled={line.quantity >= 10}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.lineRight}>
                    <span className={styles.linePrice}>£{lineTotal.toFixed(2)}</span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => remove(line.slug)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {lines.length > 0 && (
        <div className={styles.foot}>
          <div className={styles.totals}>
            <span className={styles.totalsLabel}>Subtotal</span>
            <span className={styles.totalsValue}>£{subtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className={styles.checkout}
            onClick={checkout}
            disabled={submitting}
          >
            {submitting ? "Opening Stripe…" : "Checkout"}
          </button>
          <p className={styles.note}>Shipping and taxes calculated at checkout.</p>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </dialog>
  );
}
