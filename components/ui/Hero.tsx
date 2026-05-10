import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./Hero.module.css";

type Props = {
  flag: string;
  title: ReactNode;
  size?: "xl" | "lg" | "md";
  actions?: ReactNode;
  titleId?: string;
  /** Optional background image. Falls back to the default cream gradient. */
  image?: string;
  imageAlt?: string;
  /**
   * Where to anchor the background image when cropped. Defaults to "center".
   * Use "top" for portraits where the face is in the upper third of the frame.
   */
  imagePosition?: "center" | "top" | "bottom";
};

export function Hero({
  flag,
  title,
  size = "xl",
  actions,
  titleId,
  image,
  imageAlt = "",
  imagePosition = "center",
}: Props) {
  const sizeCls = size === "xl" ? styles.sizeXl : size === "lg" ? styles.sizeLg : styles.sizeMd;
  const titleSizeCls = size === "xl" ? "" : size === "lg" ? styles.titleLg : styles.titleMd;
  return (
    <section
      className={`${styles.hero} ${sizeCls} ${image ? styles.hasImage : ""}`}
      aria-labelledby={titleId}
    >
      {image ? (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: imagePosition }}
          className={styles.photoImg}
        />
      ) : (
        <div className={styles.photo} aria-hidden="true" />
      )}
      {image && <div className={styles.scrim} aria-hidden="true" />}
      <div className={styles.overlay}>
        <span className={styles.flag}>{flag}</span>
        <h1 className={`${styles.title} ${titleSizeCls}`} id={titleId}>{title}</h1>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
