import Image from "next/image";
import Link from "next/link";
import { HOMEPAGE_BESTSELLERS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./BestsellersCarousel.module.css";

export function BestsellersCarousel() {
  return (
    <section className={`${styles.wrap}`}>
      <div className="container">
        <SectionHead
          title="Bestsellers"
          trailing={<Link href="/shop" className="sectionLink">Shop all</Link>}
        />
        <div className={styles.rail} role="list">
          {HOMEPAGE_BESTSELLERS.map((p) => (
            <Link
              key={p.slug}
              href={`/shop#${p.slug}`}
              className={styles.product}
              role="listitem"
            >
              <div className={styles.img}>
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 700px) 70vw, (max-width: 1080px) 38vw, 22vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <span className={styles.name}>{p.name}</span>
              <div className={styles.priceRow}>
                <span className={styles.price}>£{p.price.toFixed(2)}</span>
                <span className={styles.add} aria-hidden>+</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
