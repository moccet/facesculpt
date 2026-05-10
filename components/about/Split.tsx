import Image from "next/image";
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
  image?: string;
  imageAlt?: string;
};

export function Split({
  step,
  title,
  paragraphs,
  alt = false,
  reverse = false,
  id,
  children,
  image,
  imageAlt = "",
}: Props) {
  const text = (
    <div className={styles.text}>
      <div className="sectionStep">{step}</div>
      <h2 className="sectionH2">{title}</h2>
      {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      {children}
    </div>
  );

  const figure = (
    <div className={styles.img}>
      {image && (
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );

  return (
    <section
      className={`${styles.section} ${alt ? styles.alt : ""} ${reverse ? styles.reverse : ""}`}
      id={id}
    >
      <div className={styles.row}>
        {!reverse && text}
        {figure}
        {reverse && text}
      </div>
    </section>
  );
}
