import { Button } from "@/components/ui/Button";
import { STUDIO } from "@/lib/content";
import styles from "./FindStudio.module.css";

export function FindStudio() {
  return (
    <section className={`${styles.wrap} section`} id="studio">
      <div className={styles.head}>
        <h2 className="sectionH2">Find a studio</h2>
      </div>
      <div className={styles.row}>
        <div className={styles.info}>
          <h3 className={styles.label}>Marylebone, London</h3>
          <div className={styles.name}>{STUDIO.name}</div>
          <div className={styles.line}>{STUDIO.street}</div>
          <div className={styles.line}>{STUDIO.area}</div>
          <p className={styles.metaText}>
            {STUDIO.transit}
            <br />
            {STUDIO.hours}
          </p>
          <div className={styles.actions}>
            <Button href="/workouts#book" variant="dark">Book</Button>
            <a
              href="https://maps.google.com/?q=10+Portman+Square+London+W1H+6AZ"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Get directions
            </a>
          </div>
        </div>
        <div className={styles.map} aria-label="Studio location map">
          <span className={styles.pin}>FaceSculpt</span>
        </div>
      </div>
    </section>
  );
}
