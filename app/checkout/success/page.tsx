import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main className="section" style={{ minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: 640, textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-2)" }}>
          Step 02 / Confirmed
        </p>
        <h1
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.015em",
            margin: "16px 0 24px",
          }}
        >
          Thank you.
        </h1>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 28px" }}>
          Your payment is in. The studio will email you within one working day to confirm the appointment time and any
          last preparation notes. A receipt has gone to your email.
        </p>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.55, fontSize: 13 }}>
          Need anything? Call the studio on{" "}
          <a href="tel:+442039513429" style={{ textDecoration: "underline" }}>+44 20 3951 3429</a> or email{" "}
          <a href="mailto:team@thewellnesslondon.com" style={{ textDecoration: "underline" }}>
            team@thewellnesslondon.com
          </a>.
        </p>
        <p style={{ marginTop: 36 }}>
          <Link href="/" style={{ textDecoration: "underline", fontSize: 13 }}>
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
