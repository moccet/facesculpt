import Image from "next/image";
import Link from "next/link";
import styles from "./TwoTiles.module.css";

export function TwoTiles() {
  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        <Link href="/workouts#book" className={styles.tile}>
          <Image
            src="/lifestyle/workouts-hero.jpg"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className={styles.bg}
          />
          <h3 className={styles.name}>Studio-grade workouts</h3>
          <span className={styles.cta}>Book a workout</span>
        </Link>
        <Link href="/shop" className={`${styles.tile} ${styles.tileAlt}`}>
          <Image
            src="/products/gua-sha.jpg"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className={styles.bg}
          />
          <h3 className={styles.name}>Tools and skincare</h3>
          <span className={styles.cta}>Shop the studio</span>
        </Link>
      </div>
    </section>
  );
}
