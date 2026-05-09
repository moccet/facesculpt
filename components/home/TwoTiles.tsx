import Link from "next/link";
import styles from "./TwoTiles.module.css";

export function TwoTiles() {
  return (
    <section className={styles.wrap}>
      <div className={styles.grid}>
        <Link href="/workouts" className={styles.tile}>
          <h3 className={styles.name}>Studio-grade workouts</h3>
          <span className={styles.cta}>Book a workout</span>
        </Link>
        <Link href="/shop" className={`${styles.tile} ${styles.tileAlt}`}>
          <h3 className={styles.name}>Tools and skincare</h3>
          <span className={styles.cta}>Shop the studio</span>
        </Link>
      </div>
    </section>
  );
}
