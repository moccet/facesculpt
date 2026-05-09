/**
 * Lightweight request helpers for API routes:
 *   - clientInfo(req) — best-effort IP + UA from headers
 *   - rateLimit(key, limit, windowMs) — in-memory per-process limiter,
 *     fine for a single Vercel/Node instance and our notification volume.
 *     Switch to Upstash Redis if we ever scale horizontally.
 *   - badRequest / serverError / ok — JSON response shorthands
 *
 * Honeypot convention: every form posts a hidden `_hp` field. If non-empty,
 * the request is silently 200'd without sending Slack.
 */

import { NextRequest, NextResponse } from "next/server";

export type ClientInfo = { ip: string; ua: string };

export function clientInfo(req: NextRequest): ClientInfo {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  return { ip, ua };
}

const HITS = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = HITS.get(key);
  if (!entry || entry.resetAt < now) {
    HITS.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export function ok(data: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ ok: true, ...data });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export function serverError(message = "Internal error"): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

export function tooMany(): NextResponse {
  return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
}

/** Validate a string field is present and within length bounds. */
export function str(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s || s.length > max) return null;
  return s;
}

/** Loose email validation — enough to reject obvious garbage at the boundary. */
export function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}
