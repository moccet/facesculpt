import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { Split } from "@/components/about/Split";
import { TeamGrid } from "@/components/about/TeamGrid";
import { RecordSection } from "@/components/about/RecordSection";
import { FoundersGrid } from "@/components/about/FoundersGrid";
import { BecomeMember } from "@/components/ui/BecomeMember";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ABOUT_FAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "FaceSculpt is the facial sculpting practice at The Wellness on Portman Square, Marylebone. Specialist therapists, clinician oversight, photographic record.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        flag="About FaceSculpt"
        title="A studio inside The Wellness."
        size="lg"
      />
      <Split
        id="studio"
        step="The studio"
        title="Inside The Wellness, second floor."
        paragraphs={[
          "The studio sits on the second floor of The Wellness on Portman Square, a private healthcare clinic operating across primary care, blood testing, IV therapy and aesthetic treatment. Two treatment rooms, a clean prep area, single-use consumables on every contact point.",
          "FaceSculpt is run as a separate practice from the medical and aesthetic clinics on the floors above. The two share a building and a clinical standard. They do not share treatment rooms or staff.",
        ]}
      />
      <TeamGrid />
      <Split
        alt
        reverse
        step="The protocol"
        title="Built around the lift line, not the surface."
        paragraphs={[
          "Each workout is built backwards from a stated outcome. Sculpt Signature is built around the lift line that runs from the platysma along the jaw, across the buccinator, up to the temporalis. The work is sequenced to that line.",
          "The studio runs three principles: clear before you sculpt, work the muscle before you cool, log the change. The protocol card issued at session one shows the order and the home routine. It is signed by the therapist.",
        ]}
      />
      <RecordSection />
      <FoundersGrid />
      <BecomeMember
        title="Become a member."
        text="Standard at £100 a month, one Sculpt Signature included plus twenty per cent off additional workouts. Plus at £250 a month for fortnightly cadence and a dedicated therapist. Three month minimum on both."
      />
      <FAQAccordion items={ABOUT_FAQ} />
    </>
  );
}
