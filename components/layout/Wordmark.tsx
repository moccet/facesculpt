import Link from "next/link";
import styles from "./Wordmark.module.css";

type Props = {
  asLink?: boolean;
  align?: "center" | "left";
  size?: "default" | "lg";
};

export function Wordmark({ asLink = true, align = "center", size = "default" }: Props) {
  const cls = [
    styles.wordmark,
    align === "left" ? styles.wordmarkLeft : "",
  ].filter(Boolean).join(" ");

  const inner = (
    <>
      <span className={`${styles.wordmark1} ${size === "lg" ? styles.wordmark1Lg : ""}`}>
        FaceSculpt
      </span>
      <span className={styles.wordmark2}>
        by <i>The Wellness</i>
      </span>
    </>
  );

  if (!asLink) {
    return <span className={cls}>{inner}</span>;
  }
  return (
    <Link href="/" className={cls} aria-label="FaceSculpt by The Wellness, home">
      {inner}
    </Link>
  );
}
