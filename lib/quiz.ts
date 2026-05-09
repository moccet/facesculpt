/**
 * Quiz schema: ordered question definitions used to drive the assessment flow.
 * Every option's `value` matches a key in LEARNINGS in `lib/recommend.ts`.
 */

export type QuestionKey =
  | "age"
  | "primary"
  | "change"
  | "implication"
  | "safety"
  | "routine"
  | "commitment"
  | "timeframe";

export type QuestionOption = { value: string; label: string };

export type Question = {
  key: QuestionKey;
  number: number;
  text: string;
  helper?: string;
  options: QuestionOption[];
};

export const QUESTIONS: Question[] = [
  {
    key: "age", number: 1,
    text: "What decade are you in?",
    options: [
      { value: "20s", label: "Twenties" },
      { value: "30s", label: "Thirties" },
      { value: "40s", label: "Forties" },
      { value: "50s", label: "Fifties" },
      { value: "60s", label: "Sixty or older" },
    ],
  },
  {
    key: "primary", number: 2,
    text: "What catches your eye first when you look at your face?",
    options: [
      { value: "jaw", label: "Jaw line, lower face" },
      { value: "cheek", label: "Cheek volume, mid-face" },
      { value: "undereye", label: "Under-eye, brow" },
      { value: "texture", label: "Skin texture, tone, pigment" },
      { value: "puffiness", label: "Puffiness, looking tired" },
      { value: "multiple", label: "Multiple of these" },
    ],
  },
  {
    key: "change", number: 3,
    text: "What's changed in the last twelve months?",
    options: [
      { value: "tired", label: "It looks more tired, softer" },
      { value: "loosening", label: "A specific area is loosening" },
      { value: "texture", label: "Texture rougher, pigment showing" },
      { value: "ahead", label: "Nothing yet, want to be ahead of it" },
    ],
  },
  {
    key: "implication", number: 4,
    text: "How does this affect you day to day?",
    options: [
      { value: "photos", label: "First thing I notice in photos" },
      { value: "lighting", label: "I'm avoiding certain lighting or angles" },
      { value: "mental", label: "Takes more headspace than I'd like" },
      { value: "early", label: "Not big yet, acting early" },
    ],
  },
  {
    key: "safety", number: 5,
    text: "Anything below currently apply to you?",
    helper: "Filters which protocols are safe to run today. Confirmed in person at session one regardless.",
    options: [
      { value: "pregnancy", label: "Pregnant or breastfeeding" },
      { value: "pacemaker", label: "Pacemaker or implanted electrical device" },
      { value: "botox", label: "Recent Botox, less than two weeks" },
      { value: "filler", label: "Recent filler, less than four weeks" },
      { value: "none", label: "None of these" },
    ],
  },
  {
    key: "routine", number: 6,
    text: "What does your current routine look like?",
    options: [
      { value: "minimal", label: "Cleanser, moisturiser, occasional SPF" },
      { value: "intermediate", label: "Daily SPF and an active serum" },
      { value: "advanced", label: "Full active routine and home tools" },
      { value: "nothing", label: "Nothing consistent" },
    ],
  },
  {
    key: "commitment", number: 7,
    text: "How much can you do at home, realistically?",
    options: [
      { value: "low", label: "Five minutes a day, no more" },
      { value: "medium", label: "Ten to fifteen minutes most evenings" },
      { value: "high", label: "Twenty plus minutes, full protocol" },
      { value: "studio", label: "Minimal, prefer to invest in studio" },
    ],
  },
  {
    key: "timeframe", number: 8,
    text: "What's your timeframe?",
    options: [
      { value: "event", label: "A specific event in the next two weeks" },
      { value: "course", label: "A visible result inside eight weeks" },
      { value: "year", label: "A year-long commitment to ongoing work" },
      { value: "single", label: "Try one session first" },
    ],
  },
];
