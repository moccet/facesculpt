import { Hero } from "@/components/ui/Hero";
import { Button } from "@/components/ui/Button";
import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import { TwoTiles } from "@/components/home/TwoTiles";
import { BecomeMember } from "@/components/ui/BecomeMember";
import { FindStudio } from "@/components/home/FindStudio";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "FaceSculpt by The Wellness",
  telephone: "+44 20 3951 3429",
  email: "team@thewellnesslondon.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "10 Portman Square",
    addressLocality: "Marylebone, London",
    postalCode: "W1H 6AZ",
    addressCountry: "GB",
  },
  openingHours: "Mo-Sa 09:00-19:00",
  priceRange: "£40 to £2400",
  url: "https://thewellnesslondon.com/facesculpt",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Hero
        flag="Now booking · Marylebone W1"
        title={<>More than a facial.<br />A sculpt.</>}
        size="xl"
        titleId="heroTitle"
        actions={
          <>
            <Button href="/workouts#book" variant="dark">Book a workout</Button>
            <Button href="/workouts#workouts" variant="light">See the workouts</Button>
          </>
        }
      />
      <BestsellersCarousel />
      <TwoTiles />
      <BecomeMember />
      <FindStudio />
    </>
  );
}
