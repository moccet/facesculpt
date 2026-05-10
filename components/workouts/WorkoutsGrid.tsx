import Image from "next/image";
import Link from "next/link";
import { WORKOUTS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./WorkoutsGrid.module.css";

export function WorkoutsGrid() {
  return (
    <section className={`${styles.wrap} section`} id="workouts">
      <div className="container">
        <SectionHead
          step="Step 1 · Choose your workout"
          title="Six workouts"
          sub="Each workout is built around a stated outcome. Sculpt Signature is the protocol the Sculpt course is built around."
        />
        <div className={styles.grid}>
          {WORKOUTS.map((w) => (
            <article key={w.slug} className={styles.card} id={w.slug}>
              <div className={styles.img}>
                {w.image && (
                  <Image
                    src={w.image}
                    alt={w.name}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 360px"
                    style={{ objectFit: "cover" }}
                  />
                )}
                {w.flag && <span className={styles.flag}>{w.flag}</span>}
              </div>
              <h3 className={styles.name}>{w.name}</h3>
              <div className={styles.metaRow}>
                <span className={styles.price}>£{w.price}</span>
                <span className={styles.meta}>{w.meta}</span>
              </div>
              <p className={styles.desc}>{w.desc}</p>
              <ul className={styles.detail}>
                {w.details.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
              <Link href={`/workouts?w=${w.bookValue}#book`} className={styles.cta}>
                Book now
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
