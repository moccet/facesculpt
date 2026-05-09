import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { TiersGrid } from "@/components/membership/TiersGrid";
import { MathSection } from "@/components/membership/MathSection";
import { HowItWorks } from "@/components/membership/HowItWorks";
import { JoinBlock } from "@/components/membership/JoinBlock";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { MEMBERSHIP_FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Membership at FaceSculpt. Standard £100 a month, Plus £250 a month. One workout included, twenty per cent off additional. Marylebone, W1.",
};

export default function MembershipPage() {
  return (
    <>
      <Hero
        flag="Membership · Two tiers"
        title="Become a member."
        size="lg"
      />
      <TiersGrid />
      <MathSection />
      <HowItWorks />
      <JoinBlock />
      <FAQAccordion
        heading="Terms"
        sideText="Full membership terms are sent in the welcome email. The headlines are below. Any question, the studio number is +44 20 3951 3429."
        showContact={false}
        items={MEMBERSHIP_FAQ}
      />
    </>
  );
}
