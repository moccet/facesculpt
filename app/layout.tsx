import type { Metadata, Viewport } from "next";
import { Inter, Tinos } from "next/font/google";
import { ChromeFrame } from "@/components/layout/ChromeFrame";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tinos = Tinos({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tinos",
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F8F4",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thewellnesslondon.com"),
  title: {
    default: "FaceSculpt by The Wellness | Facial sculpting in Marylebone",
    template: "%s · FaceSculpt by The Wellness",
  },
  description:
    "Studio-grade facial sculpting in Marylebone. Microcurrent, EMS and manual lymphatic workouts. Specialist therapists, clinician oversight from The Wellness.",
  openGraph: {
    type: "website",
    siteName: "FaceSculpt by The Wellness",
    locale: "en_GB",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${tinos.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), Helvetica, Arial, sans-serif" }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <ChromeFrame>{children}</ChromeFrame>
      </body>
    </html>
  );
}
