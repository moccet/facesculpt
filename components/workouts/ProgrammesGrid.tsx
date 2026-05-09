import Link from "next/link";
import { PROGRAMMES } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./ProgrammesGrid.module.css";

export function ProgrammesGrid() {
  return (
    <section className={`${styles.wrap} section`} id="programmes">
      <div className="container">
        <SectionHead
          step="Three commitments"
          title="Programmes"
          sub="Sculpt Day for a single visit. Sculpt Course for the eight-week protocol. Sculpt Year for the year-long record."
        />
        <div className={styles.grid}>
          {PROGRAMMES.map((p) => (
            <article
              key={p.slug}
              className={`${styles.programme} ${p.recommended ? styles.recommended : ""}`}
            >
              {p.flag && <span className={styles.flag}>{p.flag}</span>}
              <span className={styles.eyebrow}>{p.eyebrow}</span>
              <h3 className={styles.name}>{p.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{p.price}</span>
              </div>
              <p className={styles.detail}>{p.detail}</p>
              <ul className={styles.list}>
                {p.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
              <Link href={p.cta.href} className={styles.cta}>
                {p.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
