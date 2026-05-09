import styles from "./RecordSection.module.css";

const STATS = [
  { num: "02", label: "Photographic checkpoints, course" },
  { num: "06", label: "Symmetry markers per session" },
  { num: "12", label: "Months between annual reviews" },
  { num: "100%", label: "Sessions saved to the file" },
];

export function RecordSection() {
  return (
    <section className={`${styles.wrap} section`}>
      <div className="container">
        <div className={styles.step}>The record</div>
        <h2 className={styles.title}>Every session photographed and logged.</h2>
        <p className={styles.text}>
          Standardised photographs at session one, session four, and on the annual member review. AI-guided
          assessment captures facial symmetry, muscular tension and skin condition. The change is decided against
          the file, not impression. The full record is yours, available on request.
        </p>
        <div className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div className={styles.num}>{s.num}</div>
              <div className={styles.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
