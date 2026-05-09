/**
 * Static decision tree for the assessment quiz, ported verbatim from the
 * source studio recommendations. Every input is a finite enum; safety
 * answers (pregnancy, pacemaker, recent botox/filler) take precedence over
 * timeframe so contraindicated workouts are never recommended.
 */

export type Answers = {
  age?: "20s" | "30s" | "40s" | "50s" | "60s";
  primary?: "jaw" | "cheek" | "undereye" | "texture" | "puffiness" | "multiple";
  change?: "tired" | "loosening" | "texture" | "ahead";
  implication?: "photos" | "lighting" | "mental" | "early";
  safety?: "pregnancy" | "pacemaker" | "botox" | "filler" | "none";
  routine?: "minimal" | "intermediate" | "advanced" | "nothing";
  commitment?: "low" | "medium" | "high" | "studio";
  timeframe?: "event" | "course" | "year" | "single";
  name?: string;
  email?: string;
  phone?: string;
};

export type Recommendation = {
  preLine: string;
  workout: string;
  meta: string;
  reasoning: string[];
  boosters: { name: string; meta: string; reason: string }[];
  protocolText: string;
  protocol: { name: string; meta: string }[];
};

export const LEARNINGS: Record<string, Record<string, string>> = {
  age: {
    "20s": "Best decade to start. Daily SPF and a low-strength retinoid now will outperform anything you do at forty-five trying to catch up.",
    "30s": "You've been losing about one per cent of dermal collagen every year since twenty-five. The thirties are when daily habits start showing up at the year mark. Skipping them costs more than most people realise.",
    "40s": "By forty, the muscle layer matters more than the skin layer. The masseter, platysma and temporalis run the lift lines, and you can train them. That's what the studio's hands-on work is, mostly.",
    "50s": "Bone shape starts shifting in the fifties, which changes the face over years. Skin and muscle are still the layers you can move, and they respond faster than people expect.",
    "60s": "Hands-led work, lymphatic and manual sculpt, gets the best results in this decade. Microcurrent helps. Topicals quietly do their job in the background.",
  },
  primary: {
    jaw: "Most of what people call 'jaw softening' is muscle and lymph, not bone. Masseter and platysma. Both respond to consistent work because muscle moves faster than fat or bone.",
    cheek: "Cheek change is mostly fat compartments redistributing. Some of it lives in procedural territory. The studio's manual work on the cheek lift lines holds position and reads on camera.",
    undereye: "Under-eye and brow heaviness is usually muscle tone (orbicularis, frontalis) plus lymph that doesn't fully drain overnight. Microcurrent works on both.",
    texture: "Texture is the layer with the strongest evidence behind it. Retinoids, vitamin C, LED, all proven over decades. Most of the work happens at home, the studio sequences your stack and runs LED.",
    puffiness: "Pure lymph. Salt, sleep, alcohol and hormones all show up here first. Twenty minutes of focused drainage shifts it on the day. Daily home work keeps it gone.",
    multiple: "Multiple concerns at once is the case the SCULPT Course is built for. Four sessions across eight weeks, sequenced, with photographs at session one and four to track each area separately.",
  },
  change: {
    tired: "When the face reads 'tired' it's usually lymph holding fluid. Twenty minutes of focused drainage is the fastest reset. The home routine keeps it from coming back.",
    loosening: "Localised loosening is muscle and skin in some combination, specific to where it shows up. The session-one assessment maps which layer is doing what before anything else happens.",
    texture: "Texture and pigment are the easiest changes to track and the easiest to move. Retinoid, vitamin C, daily SPF. Home does most of the work, the studio runs LED and refines your stack.",
    ahead: "Acting early is the most under-priced decision in skincare. The published evidence is mostly on people already changing, which means prevention is consistently undersold.",
  },
  implication: {
    photos: "What you see in photos over months becomes what you see in mirrors. The session-one photograph gives you a fixed reference instead of an impression that drifts with light, sleep and mood.",
    lighting: "Avoiding certain lighting usually means the issue reads bigger from the inside than the outside. The session-one photograph under fixed lighting tends to surprise people on first view, both ways.",
    mental: "The headspace this takes up has its own cost. Most clients say it lifts inside the first session, before any visible change, because deciding to act on it is itself the reset.",
    early: "Acting early is the most under-priced decision in skincare. The studies are mostly on people already changing, which is why prevention quietly undersells itself in the literature.",
  },
  safety: {
    pregnancy: "From the second trimester onwards, SCULPT Hands is the protocol. Full lymphatic and manual work at the same depth as the flagship, just no electrical. A pregnancy-trained therapist runs it.",
    pacemaker: "With an implanted electrical device, hands-only is the rule. SCULPT Hands runs the same depth as the flagship: lymphatic, manual sculpt, hot and cold stone. No microcurrent, no EMS.",
    botox: "Wait two weeks after Botox before any microcurrent or EMS. Fresh product needs time to settle. SCULPT Hands works from day one if you want to start sooner.",
    filler: "Filler takes four weeks to settle before microcurrent or EMS, otherwise placement can shift. SCULPT Hands works from day one and is what most people book in the interim.",
    none: "Full programme is open to you. The studio runs an intake at session one to confirm there's nothing in your history that needs flagging.",
  },
  routine: {
    minimal: "Two additions take you from foundation to most of the achievable home result: daily SPF and a low-strength retinoid. The studio plan stacks on top of those.",
    intermediate: "You're already doing the high-evidence work. The next layer is muscle: microcurrent or EMS at home, paired with studio sessions. Home runs consistency, studio runs depth.",
    advanced: "You've covered the home ceiling. Studio depth is the remaining lever. Most people at this level run SCULPT Plus.",
    nothing: "Most clients start here, honestly. The studio writes the home protocol around your specific findings at session one, instead of from a template.",
  },
  commitment: {
    low: "Five minutes is enough. SPF, vitamin C, retinoid, plus a one-minute morning lymphatic sweep covers the highest-evidence interventions in that window.",
    medium: "The standard plan. Morning routine plus a fuller evening: cleanse, manual sculpt, retinoid, recovery. Microcurrent fits in if you have a device at home.",
    high: "Full home protocol. Studio sessions add depth work on top of what you're already doing. Year-long programmes make the most sense at this commitment level.",
    studio: "SCULPT Plus is built for this. Fortnightly studio visits, light home routine, one named therapist across the year. The studio sessions carry the work.",
  },
  timeframe: {
    event: "SCULPT Day is built for this. Three hours, the flagship paired with Contour Reset, two boosters of your choice, lunch in the studio. Same-day depuffing reads on camera that evening, deeper work compounds for ten to fourteen days.",
    course: "SCULPT Course is the most-booked programme. Four flagship workouts fortnightly, photographs at session one and four. You compare progress against your own file rather than against memory.",
    year: "Either SCULPT Year (twenty-four sessions, photographic review at month one, six and twelve) or membership from £100 a month for a steady monthly cadence.",
    single: "SCULPT Express at twenty minutes, or the flagship SCULPT Signature at forty. Either way, the studio writes your full home protocol on the day.",
  },
};

export function recommend(a: Answers): Recommendation {
  const r: Recommendation = {
    preLine: "",
    workout: "",
    meta: "",
    reasoning: [],
    boosters: [],
    protocolText: "",
    protocol: [],
  };

  const firstName = a.name ? a.name.split(" ")[0] : "";
  r.preLine = firstName ? `${firstName}, based on your answers:` : "Based on your answers:";

  // Safety overrides take precedence
  if (a.safety === "pregnancy") {
    r.workout = "SCULPT Hands";
    r.meta = "40 minutes · £110 · Pregnancy-safe from second trimester";
    r.reasoning.push("Pregnancy means hands-only, no electrical. SCULPT Hands runs the same depth as the flagship: lymphatic clearance and manual sculpt. Pregnancy-trained therapist, gestational stage confirmed on the day.");
  } else if (a.safety === "pacemaker") {
    r.workout = "SCULPT Hands";
    r.meta = "40 minutes · £110 · Hands and stone, no electrical";
    r.reasoning.push("With an implanted electrical device, hands-only is the rule. SCULPT Hands is the same depth as the flagship workout, just without microcurrent or EMS. Lymphatic and manual sculpt unchanged.");
  } else if (a.safety === "botox") {
    r.workout = "SCULPT Hands now, SCULPT Signature in two weeks";
    r.meta = "£110 immediate, £110 follow-up";
    r.reasoning.push("You'll need two weeks between Botox and any microcurrent or EMS, otherwise the freshly placed product can shift. SCULPT Hands works from day one. Best to book both today: hands this week, flagship at the two-week mark.");
  } else if (a.safety === "filler") {
    r.workout = "SCULPT Hands now, SCULPT Signature in four weeks";
    r.meta = "£110 immediate, £110 follow-up";
    r.reasoning.push("Filler takes four weeks to settle before microcurrent or EMS can run safely. SCULPT Hands is open immediately. Booking both today locks in your slots: hands this week, flagship at week four.");
  } else {
    if (a.timeframe === "event") {
      r.workout = "SCULPT Day";
      r.meta = "3 hours · £495 · Studio half-day intensive";
      r.reasoning.push("Two weeks until the event lines up with SCULPT Day. Three hours: the flagship paired with Contour Reset, two boosters of your choice, lunch in the studio. Same-day depuffing reads on camera that evening, the deeper work compounds across the following two weeks.");
    } else if (a.timeframe === "course") {
      r.workout = "SCULPT Course";
      r.meta = "4 sessions over 8 weeks · £440 · Most-chosen programme";
      r.reasoning.push("Eight weeks lines up with the SCULPT Course. Four flagship workouts fortnightly, photographs at session one and four. You compare progress against your own file rather than against memory, which is the only way to see slow change clearly.");
    } else if (a.timeframe === "year") {
      if (a.commitment === "high") {
        r.workout = "SCULPT Year";
        r.meta = "24 sessions · £2,400 · The year-long documented protocol";
        r.reasoning.push("Twelve months and you're putting in real home time. That's what SCULPT Year is built for: twenty-four sessions, photographic review at month one, six and twelve, plus the annual review with the founding doctor.");
      } else if (a.commitment === "studio") {
        r.workout = "SCULPT Plus membership";
        r.meta = "£250 per month · Two workouts included · Dedicated therapist";
        r.reasoning.push("Year-long with light home commitment fits SCULPT Plus. Fortnightly studio visits, one named therapist who reads your file every time you come in. Subtle asymmetries get noticed faster when the same person is doing the work each visit.");
      } else {
        r.workout = "SCULPT Member";
        r.meta = "£100 per month · One workout included · Annual photographic review";
        r.reasoning.push("Year-long ongoing work at moderate cadence fits SCULPT Member at £100 a month. One flagship workout included monthly, twenty per cent off additional sessions, ten per cent off the boutique. Pays back inside the second visit.");
      }
    } else {
      // single
      if (a.primary === "puffiness" || a.change === "tired") {
        r.workout = "SCULPT Express";
        r.meta = "20 minutes · £75 · A focused reset";
        r.reasoning.push("Single session, primary concern is puffiness or tiredness. SCULPT Express is built for this: twenty minutes of focused lymphatic clearance plus a manual finish. The studio writes your full home protocol on the day either way.");
      } else {
        r.workout = "SCULPT Signature";
        r.meta = "40 minutes · £110 · The flagship";
        r.reasoning.push("Single session, foundational work. SCULPT Signature is the default flagship: forty minutes covering lymphatic clearance, manual sculpt, microcurrent, EMS in held positions, and recovery. Standardised photographs at session one regardless.");
      }
    }
  }

  if (a.implication === "photos" || a.implication === "lighting") {
    r.reasoning.push("You said this is what catches your eye in photos or under certain lighting. The session-one photograph gives you a fixed reference under controlled conditions, which is the only honest way to track slow change.");
  } else if (a.implication === "mental") {
    r.reasoning.push("You said this takes more headspace than you'd like. Most clients say that part lifts inside the first session, before anything visible has changed, because deciding to act on it is itself the reset.");
  } else if (a.age === "20s" || a.age === "30s") {
    r.reasoning.push("You're starting at the right age. The compounding effect of consistent work across the next decade matters more than any single intervention you could pick now.");
  } else if (a.age === "40s") {
    r.reasoning.push("In your forties, muscle is where most of the leverage sits. The depth a trained therapist reaches on the masseter, platysma and temporalis is not something you can replicate at home.");
  } else if (a.age === "50s" || a.age === "60s") {
    r.reasoning.push("At this stage, muscle position and skin quality are the levers worth pulling. Both reachable. The studio's hands-on depth is where the clearest changes come from.");
  }

  if (!(a.safety === "pregnancy" || a.safety === "pacemaker")) {
    if (a.primary === "jaw") {
      r.boosters.push({ name: "Jaw EMS booster", meta: "15 min · £65", reason: "Targeted EMS along the masseter and platysma, the muscles defining the jaw line. Stacks onto your workout." });
    } else if (a.primary === "undereye") {
      r.boosters.push({ name: "Microcurrent Eye booster", meta: "10 min · £55", reason: "Two-prong microcurrent for the under-eye and brow. Reduces puffiness on the morning of an event." });
    } else if (a.primary === "texture") {
      r.boosters.push({ name: "LED Recovery booster", meta: "15 min · £40", reason: "633 nm and 830 nm, the most evidence-backed wavelengths for skin texture and tone. Hands-free." });
    } else if (a.primary === "puffiness") {
      r.boosters.push({ name: "Cryo Glow booster", meta: "10 min · £45", reason: "Targeted cooling across cheek and jaw. Tightens surface, calms redness, depuffs." });
    } else if (a.primary === "multiple") {
      r.boosters.push({ name: "LED Recovery booster", meta: "15 min · £40", reason: "For multi-area concerns, LED is the most universally useful add-on, supports collagen across the full face." });
    }
  }

  if (a.routine === "minimal") {
    r.protocolText = "Your routine is at the foundation level. Three additions carry most of the achievable home result.";
    r.protocol = [
      { name: "Daily SPF 30+, every morning", meta: "La Roche-Posay Anthelios" },
      { name: "Vitamin C serum, mornings", meta: "Paula's Choice C15 Booster" },
      { name: "Low-strength retinoid, three evenings a week to start", meta: "Medik8 Crystal Retinal 1" },
    ];
  } else if (a.routine === "intermediate") {
    r.protocolText = "You're doing the high-evidence work already. The next layer is muscle work, paired with studio sessions.";
    r.protocol = [
      { name: "Step up retinoid strength once acclimated", meta: "Medik8 Crystal Retinal 3 or 6" },
      { name: "Microcurrent at home, five evenings a week", meta: "SCULPT Pro Microcurrent, £325" },
      { name: "LED at home, three sessions a week", meta: "LED Recovery Mask, £245" },
    ];
  } else if (a.routine === "advanced") {
    r.protocolText = "You've covered the home ceiling. Studio depth is the remaining lever. Home becomes maintenance and consistency.";
    r.protocol = [
      { name: "Daily microcurrent at your tolerated level", meta: "SCULPT Pro" },
      { name: "Highest tolerated retinoid", meta: "Medik8 Crystal Retinal 10 or 20" },
      { name: "LED, four to five sessions a week", meta: "LED Recovery Mask" },
    ];
  } else {
    r.protocolText = "Starting from no consistent routine. The two highest-yield interventions are sun protection and a retinoid. Begin here.";
    r.protocol = [
      { name: "Daily SPF 30+, every morning, no exceptions", meta: "La Roche-Posay Anthelios" },
      { name: "Low-strength retinoid, three evenings a week, building to nightly", meta: "Medik8 Crystal Retinal 1" },
      { name: "Ceramide moisturiser, evenings", meta: "CeraVe range" },
    ];
  }

  return r;
}
