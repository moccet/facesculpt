import { EXPECT_STEPS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./ExpectGrid.module.css";

export function ExpectGrid() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <SectionHead
          centered
          title="What to expect"
          sub="A four-stage protocol, in this order. The work is named, the result is logged."
        />
        <div className={styles.grid}>
          {EXPECT_STEPS.map((s) => (
            <article key={s.num} className={styles.card}>
              <div className={styles.img} aria-hidden="true" />
              <span className={styles.num}>{s.num}</span>
              <h3 className={styles.name}>{s.name}</h3>
              <p className={styles.desc}>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
