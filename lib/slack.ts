/**
 * Shared Slack webhook helpers — ported from thewellness/src/lib/slack.ts.
 * Single env var: SLACK_WEBHOOK_URL.
 */

export async function postWithRetry(
  url: string,
  body: unknown,
  attempts = 3,
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.ok || response.status < 500) return response;
      lastError = new Error(`Slack webhook ${response.status}`);
    } catch (err) {
      lastError = err;
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 300 * Math.pow(2, i)));
    }
  }
  throw lastError;
}

/**
 * Convenience wrapper. Returns undefined when SLACK_WEBHOOK_URL is unset
 * so calls are no-ops in local/dev/preview without env configured.
 */
export async function postSlack(
  text: string,
  blocks?: unknown[],
): Promise<Response | undefined> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.log("[slack] SLACK_WEBHOOK_URL not set, skipping notification");
    return undefined;
  }
  return postWithRetry(url, blocks ? { text, blocks } : { text });
}

/** UK-formatted timestamp for message bodies. */
export function ukNow(): string {
  return new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
}
