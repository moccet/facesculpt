import Image from "next/image";
import { TEAM } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import styles from "./TeamGrid.module.css";

export function TeamGrid() {
  return (
    <section className={`${styles.wrap} section`} id="team">
      <div className="container">
        <SectionHead step="The team" title="Three therapists, in rotation" centered />
        <div className={styles.grid}>
          {TEAM.map((m) => (
            <article key={m.name} className={styles.card}>
              <div className={styles.img}>
                {m.image && (
                  <Image
                    src={m.image}
                    alt={`${m.name}: ${m.role}`}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <span className={styles.name}>{m.name}</span>
              <span className={styles.role}>{m.role}</span>
              <p className={styles.bio}>{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
