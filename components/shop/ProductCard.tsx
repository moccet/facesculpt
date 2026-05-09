import Link from "next/link";
import type { Product } from "@/lib/types";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  alt?: boolean;
};

export function ProductCard({ product, alt = false }: Props) {
  return (
    <Link
      href={`/shop#${product.slug}`}
      className={`${styles.product} ${alt ? styles.productAlt : ""}`}
      id={product.slug}
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
        <span className={styles.add} aria-hidden>+</span>
      </div>
    </Link>
  );
}
