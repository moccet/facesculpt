import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { ProductFilter } from "@/components/shop/ProductFilter";
import { ProductCategory } from "@/components/shop/ProductCategory";
import { PreorderNote } from "@/components/shop/PreorderNote";
import { ShopCallout } from "@/components/shop/ShopCallout";
import { BecomeMember } from "@/components/ui/BecomeMember";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Tools, skincare and kits used at FaceSculpt by The Wellness. Pre-order ahead of launch. Members ten per cent off everything.",
};

export default function ShopPage() {
  return (
    <>
      <Hero
        flag="Tools · Skincare · Kits · Pre-order open"
        title="Shop the studio."
        size="md"
      />
      <ProductFilter />
      <ProductCategory
        category="tools"
        variant="cream"
        id="tools"
        step="Tools · Microcurrent, EMS, mechanical"
        title="The tools we use"
        sub="Studio-grade where the budget allows, retail-grade where the difference is small. Each tool is what we run on the day."
      />
      <ProductCategory
        category="skincare"
        variant="paper"
        id="skincare"
        step="Skincare · Topicals from the protocol"
        title="The skincare"
        sub="Six topicals that run alongside the workouts. Each is named in the written protocol issued at session one."
      />
      <ProductCategory
        category="kits"
        variant="cream"
        id="kits"
        step="Kits · Bundles from the protocol"
        title="The kits"
        sub="Four bundles built around the workouts. Each is what the studio recommends after first booking."
      />
      <PreorderNote />
      <ShopCallout />
      <BecomeMember
        title="Members get ten per cent."
        text="Standard at £100 a month, one Sculpt Signature included plus twenty per cent off additional workouts and ten per cent off the shop. Plus at £250 a month for fortnightly cadence."
      />
    </>
  );
}
