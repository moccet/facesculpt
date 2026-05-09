import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The assessment",
  description:
    "A clinical assessment from FaceSculpt. Ninety seconds. Personalised plan with the studio's reasoning, a home protocol, and three ways to book.",
};

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
