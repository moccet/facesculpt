import { FOUNDERS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./FoundersGrid.module.css";

export function FoundersGrid() {
  return (
    <section className={`${styles.wrap} section`} id="founders">
      <div className="container">
        <SectionHead step="The founders" title="Built by Omar and Sofian" centered />
        <div className={styles.grid}>
          {FOUNDERS.map((f) => (
            <article key={f.name} className={styles.card}>
              <div className={styles.img} aria-hidden="true" />
              <span className={styles.name}>{f.name}</span>
              <span className={styles.role}>{f.role}</span>
              <p className={styles.bio}>{f.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
