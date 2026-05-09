"use client";

import { useState } from "react";

type Props = {
  tier: "standard" | "plus";
  className: string;
  children: React.ReactNode;
};

/**
 * Client button that POSTs to /api/stripe/checkout and redirects to the
 * returned hosted Checkout URL. Used by both TiersGrid and JoinBlock.
 */
export function SubscribeButton({ tier, className, children }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function start() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "membership", tier }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout — try the studio direct.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — try again or call the studio.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={start}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Loading…" : children}
      </button>
      {error && (
        <p role="alert" style={{ color: "#b00020", fontSize: 13, marginTop: 8 }}>
          {error}
        </p>
      )}
    </>
  );
}
