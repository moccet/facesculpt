import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <main className="section" style={{ minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: 640, textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-2)" }}>
          Checkout cancelled
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
          No charge made.
        </h1>
        <p style={{ color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 32px" }}>
          You closed the payment screen before it completed. Nothing was taken. The studio still has your booking
          enquiry — call us if you want to pay another way, or try again from the workouts page.
        </p>
        <p style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/workouts#book" style={{ textDecoration: "underline", fontSize: 13 }}>
            Back to booking
          </Link>
          <span aria-hidden style={{ color: "var(--ink-2)" }}>·</span>
          <a href="tel:+442039513429" style={{ textDecoration: "underline", fontSize: 13 }}>
            Call the studio
          </a>
        </p>
      </div>
    </main>
  );
}
