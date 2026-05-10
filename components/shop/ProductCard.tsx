"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  alt?: boolean;
};

const ADDED_FEEDBACK_MS = 900;

export function ProductCard({ product, alt = false }: Props) {
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function onAdd() {
    add(product.slug, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      className={`${styles.product} ${alt ? styles.productAlt : ""}`}
      id={product.slug}
      aria-label={`Add ${product.name} to bag, £${product.price.toFixed(2)}`}
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
          <span className={styles.member}>members £{product.memberPrice}</span>
        </div>
        <span
          className={styles.add}
          aria-hidden
          style={
            justAdded
              ? { background: "var(--ink)", color: "var(--paper)" }
              : undefined
          }
        >
          {justAdded ? "✓" : "+"}
        </span>
      </div>
    </button>
  );
}
