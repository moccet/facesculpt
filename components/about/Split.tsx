import type { ReactNode } from "react";
import styles from "./Split.module.css";

type Props = {
  step: string;
  title: string;
  paragraphs: string[];
  alt?: boolean;
  reverse?: boolean;
  id?: string;
  children?: ReactNode;
};

export function Split({ step, title, paragraphs, alt = false, reverse = false, id, children }: Props) {
  return (
    <section
      className={`${styles.section} ${alt ? styles.alt : ""} ${reverse ? styles.reverse : ""}`}
      id={id}
    >
      <div className={styles.row}>
        {!reverse && <div className={styles.text}>
          <div className="sectionStep">{step}</div>
          <h2 className="sectionH2">{title}</h2>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          {children}
        </div>}
        <div className={styles.img} aria-hidden="true" />
        {reverse && <div className={styles.text}>
          <div className="sectionStep">{step}</div>
          <h2 className="sectionH2">{title}</h2>
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          {children}
        </div>}
      </div>
    </section>
  );
}
