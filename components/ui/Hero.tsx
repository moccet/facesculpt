import type { ReactNode } from "react";
import styles from "./Hero.module.css";

type Props = {
  flag: string;
  title: ReactNode;
  size?: "xl" | "lg" | "md";
  actions?: ReactNode;
  titleId?: string;
};

export function Hero({ flag, title, size = "xl", actions, titleId }: Props) {
  const sizeCls = size === "xl" ? styles.sizeXl : size === "lg" ? styles.sizeLg : styles.sizeMd;
  const titleSizeCls = size === "xl" ? "" : size === "lg" ? styles.titleLg : styles.titleMd;
  return (
    <section className={`${styles.hero} ${sizeCls}`} aria-labelledby={titleId}>
      <div className={styles.photo} aria-hidden="true" />
      <div className={styles.overlay}>
        <span className={styles.flag}>{flag}</span>
        <h1 className={`${styles.title} ${titleSizeCls}`} id={titleId}>{title}</h1>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
