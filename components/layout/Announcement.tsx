import Link from "next/link";
import styles from "./Announcement.module.css";

export function Announcement() {
  return (
    <div className={styles.announce}>
      Free protocol guide with every first booking ·{" "}
      <Link href="/workouts#book">Book a workout</Link>
    </div>
  );
}
