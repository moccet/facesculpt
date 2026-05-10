import Image from "next/image";
import { BOOSTERS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./BoostersGrid.module.css";

export function BoostersGrid() {
  return (
    <section className={`${styles.wrap} section`} id="boosters">
      <div className="container">
        <SectionHead
          step="Step 2 · Personalise your workout"
          title="Four boosters"
          sub="Targeted add-ons, ten to fifteen minutes each. Stack onto any workout."
        />
        <div className={styles.grid}>
          {BOOSTERS.map((b) => (
            <article key={b.slug} className={styles.card}>
              <div className={styles.img}>
                {b.image && (
                  <Image
                    src={b.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <h3 className={styles.name}>{b.name}</h3>
              <div className={styles.metaRow}>
                <span className={styles.price}>£{b.price}</span>
                <span className={styles.meta}>{b.durationLabel}</span>
              </div>
              <p className={styles.desc}>{b.desc}</p>
            </article>
          ))}
        </div>
        <p className={styles.note}>Boosters added at booking, or on the day if the diary allows</p>
      </div>
    </section>
  );
}
