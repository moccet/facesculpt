import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "./NewsletterForm";
import styles from "./SiteFooter.module.css";

const COLS = [
  {
    heading: "Book",
    links: [
      { href: "/workouts#book", label: "Book a workout" },
      { href: "/workouts#workouts", label: "Workouts" },
      { href: "/workouts#boosters", label: "Boosters" },
      { href: "/workouts#programmes", label: "Programmes" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { href: "/shop#tools", label: "Tools" },
      { href: "/shop#skincare", label: "Skincare" },
      { href: "/shop#kits", label: "Kits" },
      { href: "/shop", label: "Bestsellers" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/about#team", label: "The team" },
      { href: "/membership", label: "Membership" },
      { href: "https://thewellnesslondon.com", label: "The Wellness" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "mailto:team@thewellnesslondon.com", label: "Contact" },
      { href: "tel:+442039513429", label: "+44 20 3951 3429" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Wordmark asLink={false} align="left" size="lg" />
          <NewsletterForm />
        </div>
        {COLS.map((c) => (
          <div key={c.heading} className={styles.col}>
            <h4>{c.heading}</h4>
            <ul>
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} FaceSculpt by The Wellness</span>
        <span>10 Portman Square · Marylebone W1H 6AZ</span>
      </div>
    </footer>
  );
}
