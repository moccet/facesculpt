import Image from "next/image";
import { Button } from "./Button";
import styles from "./BecomeMember.module.css";

type Props = {
  title?: string;
  text?: string;
};

const DEFAULT_TEXT =
  "£100 a month. One Sculpt Signature workout included, twenty per cent off additional workouts and ten per cent off the shop. Three month minimum, then rolling.";

export function BecomeMember({ title = "Become a member", text = DEFAULT_TEXT }: Props) {
  return (
    <section className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.img}>
          <Image
            src="/lifestyle/become-member.jpg"
            alt="Manual sculpt at the studio"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.info}>
          <span className={styles.eyebrow}>Membership</span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>{text}</p>
          <div className={styles.actions}>
            <Button href="/membership" variant="dark">Join today</Button>
            <Button href="/membership#tiers" variant="outline">See both tiers</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
