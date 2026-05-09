import { PRODUCTS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { ProductCard } from "./ProductCard";
import styles from "./ProductCategory.module.css";

type CatKey = "tools" | "skincare" | "kits";

type Props = {
  category: CatKey;
  variant: "cream" | "paper";
  step: string;
  title: string;
  sub: string;
  id: string;
};

export function ProductCategory({ category, variant, step, title, sub, id }: Props) {
  const items = PRODUCTS.filter((p) => p.category === category);
  return (
    <section
      id={id}
      data-cat={category}
      className={`${styles.cat} ${variant === "cream" ? styles.catCream : styles.catPaper}`}
    >
      <div className="container">
        <SectionHead centered step={step} title={title} sub={sub} />
        <div className={styles.grid}>
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} alt={variant === "paper"} />
          ))}
        </div>
      </div>
    </section>
  );
}
