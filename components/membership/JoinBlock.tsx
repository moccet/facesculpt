import { Button } from "@/components/ui/Button";
import { SubscribeButton } from "./SubscribeButton";
import buttonStyles from "@/components/ui/Button.module.css";
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
            Subscribe via Stripe. Three month minimum, then rolling. Cancel any time after that with thirty days notice.
          </p>
          <div className={styles.actions}>
            <SubscribeButton
              tier="standard"
              className={`${buttonStyles.btn} ${buttonStyles.dark}`}
            >
              Join Standard, £100/mo
            </SubscribeButton>
            <SubscribeButton
              tier="plus"
              className={`${buttonStyles.btn} ${buttonStyles.outline}`}
            >
              Join Plus, £250/mo
            </SubscribeButton>
            <Button href="tel:+442039513429" variant="outline">Call the studio</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
