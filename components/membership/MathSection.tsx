import styles from "./MathSection.module.css";

const LINES = [
  { label: "Public price · Sculpt Signature × 2", value: "£220" },
  { label: "Member · 1 included + 1 at 20% off", value: "£100 + £88" },
  { label: "Member total per month, two visits", value: "£188" },
];

export function MathSection() {
  return (
    <section className={`${styles.wrap} section`} id="math">
      <div className={styles.row}>
        <div className={styles.text}>
          <div className="sectionStep">The math</div>
          <h2 className="sectionH2">Pays back at the second visit.</h2>
          <p>
            One Sculpt Signature included covers the membership fee inside the first month. Every additional visit is
            twenty per cent below the public price. Two visits a month, the member is already ahead of pay-as-you-go.
          </p>
        </div>
        <div className={styles.rows}>
          {LINES.map((l) => (
            <div key={l.label} className={styles.line}>
              <span className={styles.label}>{l.label}</span>
              <span className={styles.value}>{l.value}</span>
            </div>
          ))}
          <div className={`${styles.line} ${styles.total}`}>
            <span className={styles.label}>Saving against the public diary</span>
            <span className={styles.value}>£32</span>
          </div>
        </div>
      </div>
    </section>
  );
}
