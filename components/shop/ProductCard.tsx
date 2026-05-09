"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  alt?: boolean;
};

export function ProductCard({ product, alt = false }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function buy() {
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "product", slug: product.slug, quantity: 1 }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string };
      if (!res.ok || !data.url) {
        setError(true);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={buy}
      className={`${styles.product} ${alt ? styles.productAlt : ""}`}
      id={product.slug}
      aria-busy={loading}
      aria-label={`Buy ${product.name} for £${product.price.toFixed(2)}`}
      style={{ textAlign: "left", border: "none", cursor: "pointer", width: "100%" }}
    >
      <div className={styles.img}>
        {product.flag && <span className={styles.flag}>{product.flag}</span>}
      </div>
      <span className={styles.name}>{product.name}</span>
      <span className={styles.meta}>{product.meta}</span>
      <div className={styles.priceRow}>
        <div className={styles.priceStack}>
          <span className={styles.price}>£{product.price.toFixed(2)}</span>
          <span className={styles.member}>
            {error ? "Try again" : `members £${product.memberPrice}`}
          </span>
        </div>
        <span className={styles.add} aria-hidden>{loading ? "…" : "+"}</span>
      </div>
    </button>
  );
}
