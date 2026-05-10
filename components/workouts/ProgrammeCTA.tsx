"use client";

/**
 * Programme card CTA. For paid programmes that already route to the booking
 * flow (Sculpt Course → /workouts?w=course#book) we render a plain link.
 * For mailto-style enquiries (Sculpt Day, Sculpt Year) we fire a Slack
 * beacon first, then let the browser open the mail client. The beacon
 * uses sendBeacon-style keepalive so the request goes out even though
 * navigation/external-app launch follows immediately.
 */
type Props = {
  href: string;
  slug: string;
  className: string;
  children: React.ReactNode;
};

export function ProgrammeCTA({ href, slug, className, children }: Props) {
  const isMailto = href.startsWith("mailto:");

  function handleClick() {
    if (!isMailto) return;
    try {
      fetch("/api/programme/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // best-effort; don't block the mailto
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
