/**
 * Shared Slack webhook helpers — ported from thewellness/src/lib/slack.ts.
 * Single env var: SLACK_WEBHOOK_URL.
 */

const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

async function readBodySnippet(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text.length > 200 ? text.slice(0, 200) + "…" : text;
  } catch {
    return "";
  }
}

export async function postWithRetry(
  url: string,
  body: unknown,
  attempts = 3,
): Promise<Response> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    let response: Response | undefined;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      lastError = err;
      console.error(
        `[slack] post attempt ${i + 1}/${attempts} network error:`,
        err instanceof Error ? err.message : err,
      );
    }

    if (response) {
      if (response.ok) return response;
      const snippet = await readBodySnippet(response);
      const msg = `Slack webhook responded ${response.status}: ${snippet}`;
      console.error(`[slack] ${msg}`);
      // 4xx (other than 408/425/429) means the URL is dead/unauthorized —
      // retrying won't help, surface the failure immediately.
      if (!RETRY_STATUSES.has(response.status)) {
        throw new Error(msg);
      }
      lastError = new Error(msg);
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
    console.warn("[slack] SLACK_WEBHOOK_URL not set — skipping notification");
    return undefined;
  }
  return postWithRetry(url, blocks ? { text, blocks } : { text });
}

/** UK-formatted timestamp for message bodies. */
export function ukNow(): string {
  return new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
}
