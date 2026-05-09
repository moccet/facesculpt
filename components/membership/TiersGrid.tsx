import { TIERS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { SubscribeButton } from "./SubscribeButton";
import styles from "./TiersGrid.module.css";

/**
 * Tier list items use **bold** markdown for the included-workout phrase.
 * Render that bit as <strong> without pulling in a markdown lib.
 */
function renderListItem(text: string) {
  const m = text.match(/^\*\*([^*]+)\*\*(.*)$/);
  if (!m) return text;
  return (
    <>
      <strong>{m[1]}</strong>
      {m[2]}
    </>
  );
}

export function TiersGrid() {
  return (
    <section className={`${styles.wrap} section`} id="tiers">
      <div className="container">
        <SectionHead
          centered
          step="Two tiers, single rate each"
          title="Pick a tier"
          sub="Standard for monthly cadence. Plus for fortnightly and a dedicated therapist. Three month minimum on both."
        />
        <div className={styles.grid}>
          {TIERS.map((t) => (
            <article
              key={t.variant}
              className={`${styles.tier} ${styles[t.variant]}`}
            >
              {t.flag && <span className={styles.flag}>{t.flag}</span>}
              <span className={styles.eyebrow}>{t.eyebrow}</span>
              <h3 className={styles.name}>{t.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{t.price}</span>
                <span className={styles.period}>{t.period}</span>
              </div>
              <p className={styles.strap}>{t.strap}</p>
              <ul className={styles.list}>
                {t.list.map((item, i) => (
                  <li key={i}>
                    <span className={styles.num}>{(i + 1).toString().padStart(2, "0")}</span>
                    <span>{renderListItem(item)}</span>
                  </li>
                ))}
              </ul>
              <SubscribeButton tier={t.variant} className={styles.cta}>
                {t.ctaLabel}
              </SubscribeButton>
            </article>
          ))}
        </div>
        <p className={styles.note}>The same rate for every member at every point. No early access tiers.</p>
      </div>
    </section>
  );
}
