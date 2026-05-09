import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { WhatWeDo } from "@/components/workouts/WhatWeDo";
import { ExpectGrid } from "@/components/workouts/ExpectGrid";
import { WorkoutsGrid } from "@/components/workouts/WorkoutsGrid";
import { BoostersGrid } from "@/components/workouts/BoostersGrid";
import { ProgrammesGrid } from "@/components/workouts/ProgrammesGrid";
import { BookingForm } from "@/components/workouts/BookingForm";
import { BecomeMember } from "@/components/ui/BecomeMember";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { WORKOUTS_FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "Workouts",
  description:
    "Six workouts and four boosters at FaceSculpt by The Wellness. Sculpt Signature £110, Sculpt Course £440. Marylebone, W1.",
};

export default function WorkoutsPage() {
  return (
    <>
      <Hero
        flag="Workouts · Boosters · Programmes"
        title={<>More than a facial.<br />A workout.</>}
        size="lg"
      />
      <WhatWeDo />
      <ExpectGrid />
      <WorkoutsGrid />
      <BoostersGrid />
      <ProgrammesGrid />
      <BookingForm />
      <BecomeMember
        title="Become a member"
        text="Standard at £100 a month, one Sculpt Signature included plus twenty per cent off additional workouts and ten per cent off the shop. Plus at £250 a month for fortnightly cadence and a dedicated therapist."
      />
      <FAQAccordion items={WORKOUTS_FAQ} />
    </>
  );
}
