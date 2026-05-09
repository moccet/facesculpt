import { NextRequest } from "next/server";
import { postSlack, ukNow } from "@/lib/slack";
import { badRequest, clientInfo, isEmail, ok, rateLimit, serverError, str, tooMany } from "@/lib/api";
import { recommend, type Answers } from "@/lib/recommend";
import { QUESTIONS } from "@/lib/quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_KEYS = new Set(QUESTIONS.map((q) => q.key));

function pickAnswers(raw: Record<string, unknown>): Answers {
  const out: Answers = {};
  for (const q of QUESTIONS) {
    const v = raw[q.key];
    if (typeof v === "string") {
      const allowed = q.options.some((o) => o.value === v);
      if (allowed) (out as Record<string, string>)[q.key] = v;
    }
  }
  return out;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  if (typeof body._hp === "string" && body._hp.length > 0) return ok();

  const info = clientInfo(req);
  if (!rateLimit(`assessment:${info.ip}`, 4, 60_000)) return tooMany();

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  if (!name) return badRequest("Name required");
  if (!email || !isEmail(email)) return badRequest("Valid email required");
  if (!phone) return badRequest("Phone required");

  const answersRaw = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, unknown>;
  const answers: Answers = { ...pickAnswers(answersRaw), name, email, phone };

  const rec = recommend(answers);

  const answerLines = QUESTIONS
    .filter((q) => VALID_KEYS.has(q.key) && answers[q.key])
    .map((q) => {
      const value = answers[q.key];
      const label = q.options.find((o) => o.value === value)?.label ?? value;
      return `• *${q.text}* — ${label}`;
    })
    .join("\n");

  const protocolLines = rec.protocol
    .map((p) => `• *${p.name}* — ${p.meta}`)
    .join("\n");

  const boosterLines = rec.boosters
    .map((b) => `• *${b.name}* — ${b.meta}`)
    .join("\n");

  const blocks: unknown[] = [
    { type: "header", text: { type: "plain_text", text: "🎯 FaceSculpt — assessment completed" } },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Name*\n${name}` },
        { type: "mrkdwn", text: `*Email*\n${email}` },
        { type: "mrkdwn", text: `*Phone*\n${phone}` },
        { type: "mrkdwn", text: `*Recommended*\n${rec.workout}` },
      ],
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Meta*\n${rec.meta}` },
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Their answers*\n${answerLines || "—"}` },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: `*Reasoning*\n${rec.reasoning.map((p) => `• ${p}`).join("\n")}` },
    },
  ];

  if (boosterLines) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Suggested boosters*\n${boosterLines}` },
    });
  }
  if (protocolLines) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Home protocol*\n${rec.protocolText}\n${protocolLines}` },
    });
  }
  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `IP: ${info.ip} · ${ukNow()}` }],
  });

  const fallback = `Assessment completed — ${name} · ${rec.workout}`;

  try {
    await postSlack(fallback, blocks);
    return ok();
  } catch (err) {
    console.error("[assessment/submit] slack post failed:", err);
    return serverError();
  }
}
