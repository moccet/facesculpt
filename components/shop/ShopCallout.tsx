import { Button } from "@/components/ui/Button";
import styles from "./ShopCallout.module.css";

export function ShopCallout() {
  return (
    <section className={styles.wrap}>
      <div className={styles.row}>
        <div>
          <div className={styles.eyebrow}>The studio&apos;s most ordered</div>
          <h2 className={styles.title}>Sculpt Pro Microcurrent.</h2>
          <p className={styles.text}>
            The same two-prong microcurrent device that runs in Sculpt Signature and EMS Lift Intensive. Four levels,
            USB-C, twelve hour battery. The full home protocol is included on a printed card.
          </p>
          <div className={styles.actions}>
            <Button href="/shop#sculpt-pro" variant="light">Pre-order, £325</Button>
            <Button href="/workouts#sculpt-signature" variant="outlineLight">See it in the studio</Button>
          </div>
        </div>
        <div className={styles.img} aria-hidden="true" />
      </div>
    </section>
  );
}
