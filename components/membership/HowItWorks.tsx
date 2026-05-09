import { HOW_STEPS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  return (
    <section className={`${styles.wrap} section`} id="how">
      <div className="container">
        <SectionHead centered step="How it works" title="Four steps" />
        <div className={styles.grid}>
          {HOW_STEPS.map((s) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.num}>{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
