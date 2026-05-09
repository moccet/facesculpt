"use client";

import { usePathname } from "next/navigation";
import { Announcement } from "./Announcement";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

const FULL_BLEED_PATHS = ["/assessment"];

export function ChromeFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = FULL_BLEED_PATHS.some(
    (p) => pathname === p || pathname?.startsWith(p + "/"),
  );

  if (fullBleed) {
    return <>{children}</>;
  }
  return (
    <>
      <Announcement />
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
