import { Button } from "@/components/ui/Button";
import styles from "@/components/ui/BecomeMember.module.css";

export function JoinBlock() {
  return (
    <section className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.img} aria-hidden="true" />
        <div className={styles.info}>
          <span className={styles.eyebrow}>Membership</span>
          <h2 className={styles.title}>Join today.</h2>
          <p className={styles.text}>
            Card on file, no charge until the studio confirms session one. Three month minimum, then rolling.
            Cancel any time after that with thirty days notice.
          </p>
          <div className={styles.actions}>
            <Button href="mailto:team@thewellnesslondon.com?subject=FaceSculpt%20membership" variant="dark">
              Start the join form
            </Button>
            <Button href="tel:+442039513429" variant="outline">Call the studio</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
