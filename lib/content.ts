import type {
  Booster, FAQ, Product, Programme, Tier, Workout,
} from "./types";

export const STUDIO = {
  name: "FaceSculpt at The Wellness",
  street: "10 Portman Square",
  area: "Marylebone, London W1H 6AZ",
  phone: "+44 20 3951 3429",
  phoneHref: "tel:+442039513429",
  email: "team@thewellnesslondon.com",
  emailHref: "mailto:team@thewellnesslondon.com",
  hours: "Monday to Saturday, 09:00 – 19:00",
  transit: "Marble Arch 3 min · Bond Street 5 min · Baker Street 8 min",
  whatsapp: "https://wa.me/447961280835",
};

export const WORKOUTS: Workout[] = [
  {
    slug: "sculpt-express",
    bookValue: "express",
    name: "Sculpt Express",
    price: 75,
    durationLabel: "20 min",
    meta: "20 min",
    desc: "A focused twenty minute reset. Lymphatic drainage, manual sculpt, microcurrent finish.",
    details: [
      "Lymphatic drainage clavicle to brow",
      "Manual sculpt across cheek and jaw",
      "Microcurrent finish for tone",
    ],
    image: "/lifestyle/workout-express.jpg",
  },
  {
    slug: "sculpt-signature",
    bookValue: "signature",
    name: "Sculpt Signature",
    price: 110,
    durationLabel: "40 min",
    meta: "40 min · Flagship",
    flag: "Most booked",
    desc: "The protocol the Sculpt course is built around. Default first booking for new clients.",
    details: [
      "Full lymphatic clearance",
      "Manual sculpt across the lift lines",
      "Microcurrent across cheek, jaw, brow",
      "EMS in held positions",
      "Photograph and assessment to file",
    ],
    image: "/lifestyle/workout-signature.jpg",
  },
  {
    slug: "sculpt-hands",
    bookValue: "hands",
    name: "Sculpt Hands",
    price: 110,
    durationLabel: "40 min",
    meta: "40 min · Hands only",
    desc: "Hands-only workout, no electrical. Pregnancy-safe from second trimester.",
    details: [
      "Full lymphatic clearance, hands and stone only",
      "Manual sculpt across the lift lines",
      "Cervical and jaw release",
      "Suitable for clients with implanted electrical devices",
    ],
    image: "/lifestyle/workout-hands.jpg",
  },
  {
    slug: "jawline-define",
    bookValue: "jawline",
    name: "Jawline Define",
    price: 80,
    durationLabel: "25 min",
    meta: "25 min · Targeted",
    desc: "Twenty five minutes focused only on the lower face, jaw line and upper neck.",
    details: [
      "Manual masseter release",
      "Submandibular drainage",
      "EMS along the lower jaw",
      "Cooling finish across the lower line",
    ],
    image: "/lifestyle/workout-jawline.jpg",
  },
  {
    slug: "contour-reset",
    bookValue: "contour",
    name: "Contour Reset",
    price: 170,
    durationLabel: "60 min",
    meta: "60 min · Deep",
    desc: "Deepest workout the studio runs. Full lower face, jaw, neck and decolletage.",
    details: [
      "Full upper body and neck release",
      "Manual sculpt across the full face",
      "Microcurrent paired with targeted EMS",
      "Decolletage included",
      "Photograph and assessment to file",
    ],
    image: "/lifestyle/workout-contour.jpg",
  },
  {
    slug: "ems-lift",
    bookValue: "ems",
    name: "EMS Lift Intensive",
    price: 150,
    durationLabel: "50 min",
    meta: "50 min · EMS-led",
    desc: "Fifty minutes of EMS-led work. Muscular lift across cheek, jaw, brow.",
    details: [
      "Full prep cleanse and conductive layer",
      "EMS programme across cheek, jaw, brow",
      "Manual support during held positions",
      "Cooling and recovery finish",
    ],
    image: "/lifestyle/workout-ems.jpg",
  },
];

export const BOOSTERS: Booster[] = [
  {
    slug: "microcurrent-eye",
    name: "Microcurrent Eye",
    price: 55,
    durationLabel: "10 min",
    desc: "Two-prong microcurrent for the under-eye and brow. Reduces puffiness on the morning of an event.",
    image: "/lifestyle/workout-jawline.jpg",
  },
  {
    slug: "cryo",
    name: "Cryo Glow",
    price: 45,
    durationLabel: "10 min",
    desc: "Targeted cooling across cheek and jaw. Tightens the surface, calms redness.",
    image: "/products/cryo-globes.jpg",
  },
  {
    slug: "jaw-ems",
    name: "Jaw EMS",
    price: 65,
    durationLabel: "15 min",
    desc: "Targeted EMS along the masseter and platysma. Lifts the lower line.",
    image: "/lifestyle/workout-ems.jpg",
  },
  {
    slug: "led",
    name: "LED Recovery",
    price: 40,
    durationLabel: "15 min",
    desc: "Red and near-infrared light, hands-free. Supports collagen and recovery.",
    image: "/lifestyle/expect-finish.jpg",
  },
];

export const PROGRAMMES: Programme[] = [
  {
    slug: "sculpt-day",
    eyebrow: "A single visit · Half-day",
    name: "Sculpt Day",
    price: "£495",
    detail: "A three-hour studio reset. The flagship paired with Contour Reset, two boosters and lunch.",
    list: [
      "Sculpt Signature, full forty minutes",
      "Contour Reset, full hour",
      "Cryo Glow and LED Recovery boosters",
      "Standardised photographs at start and finish",
      "Lunch in the studio between workouts",
    ],
    cta: { label: "Enquire about a Day", href: "mailto:team@thewellnesslondon.com?subject=Sculpt%20Day" },
  },
  {
    slug: "sculpt-course",
    eyebrow: "Eight weeks · Four visits",
    name: "Sculpt Course",
    price: "£440",
    detail: "Four Sculpt Signature workouts fortnightly across eight weeks. The protocol the studio is built around.",
    list: [
      "Four Sculpt Signature workouts",
      "Photographs at session one and four",
      "Biometric assessment every visit",
      "Written protocol every visit",
      "Twelve-page protocol guide included",
    ],
    cta: { label: "Book the Course", href: "/workouts?w=course#book" },
    recommended: true,
    flag: "Most chosen",
  },
  {
    slug: "sculpt-year",
    eyebrow: "Twelve months · Twenty-four visits",
    name: "Sculpt Year",
    price: "£2,400",
    detail: "Twenty-four Sculpt Signature workouts across twelve months. The year-long record.",
    list: [
      "Twenty-four Sculpt Signature workouts",
      "Photographic checkpoints at month one, six, twelve",
      "Three written protocol updates per year",
      "Dedicated therapist across the programme",
      "Annual review with the founding doctor",
    ],
    cta: { label: "Enquire about the Year", href: "mailto:team@thewellnesslondon.com?subject=Sculpt%20Year" },
  },
];

export const PRODUCTS: Product[] = [
  // Tools
  { slug: "sculpt-pro", category: "tools", name: "Sculpt Pro Microcurrent", meta: "Two-prong · Four levels · USB-C", price: 325, memberPrice: 293, flag: "Bestseller" },
  { slug: "active-roll", category: "tools", name: "Active Roll Lymphatic", meta: "Steel ribbed roller", price: 44, memberPrice: 40 },
  { slug: "sculpt-ball", category: "tools", name: "Sculpt Ball Original", meta: "Stainless contoured ball", price: 68, memberPrice: 61 },
  { slug: "stone-set", category: "tools", name: "Sculpt Stone Set", meta: "Three stones · Cheek, jaw, eye", price: 95, memberPrice: 86, image: "/products/stone-set.jpg" },
  { slug: "led-mask", category: "tools", name: "LED Recovery Mask", meta: "Red and near-infrared", price: 245, memberPrice: 221, flag: "New" },
  { slug: "cryo-globes", category: "tools", name: "Cryo Globes Pair", meta: "Borosilicate glass · Freezer-safe", price: 52, memberPrice: 47, image: "/products/cryo-globes.jpg" },
  { slug: "gua-sha", category: "tools", name: "Sculpt Gua Sha", meta: "Bian stone · Four-edge profile", price: 36, memberPrice: 32, image: "/products/gua-sha.jpg" },
  { slug: "face-roller", category: "tools", name: "Cooling Face Roller", meta: "Stainless · Dual-end", price: 28, memberPrice: 25, image: "/products/face-roller.jpg" },
  // Skincare
  { slug: "facial-oil", category: "skincare", name: "Pro-Age Facial Oil", meta: "Squalane · Bakuchiol · 30ml", price: 72, memberPrice: 65, flag: "Bestseller" },
  { slug: "cleansing-balm", category: "skincare", name: "Lift Cleansing Balm", meta: "Olive squalane · Shea · 75g", price: 42, memberPrice: 38 },
  { slug: "contour-serum", category: "skincare", name: "Contour Serum", meta: "Peptide complex · Niacinamide · 30ml", price: 88, memberPrice: 79 },
  { slug: "vitamin-c", category: "skincare", name: "Vitamin C 15", meta: "Ethyl ascorbic acid 15% · 30ml", price: 68, memberPrice: 61 },
  { slug: "night-cream", category: "skincare", name: "Recovery Night Cream", meta: "Ceramides · Peptides · 50ml", price: 64, memberPrice: 58 },
  { slug: "eye-serum", category: "skincare", name: "Brightening Eye Serum", meta: "Caffeine 5% · Peptides · 15ml", price: 58, memberPrice: 52 },
  // Kits
  { slug: "starter-kit", category: "kits", name: "Starter Sculpt Kit", meta: "Sculpt Ball + Cleansing Balm + Oil", price: 148, memberPrice: 133 },
  { slug: "course-kit", category: "kits", name: "Sculpt Course Kit", meta: "Active Roll + Cryo + 4 topicals", price: 245, memberPrice: 221, flag: "Best value" },
  { slug: "pro-kit", category: "kits", name: "Pro Sculpt Kit", meta: "Sculpt Pro + LED Mask + 3 topicals", price: 485, memberPrice: 437 },
  { slug: "travel-kit", category: "kits", name: "Travel Sculpt Kit", meta: "Mini balm + oil + roller", price: 72, memberPrice: 65 },
];

export const HOMEPAGE_BESTSELLER_SLUGS = [
  "stone-set",
  "gua-sha",
  "cryo-globes",
  "face-roller",
  "sculpt-pro",
  "facial-oil",
  "led-mask",
  "contour-serum",
] as const;

export const HOMEPAGE_BESTSELLERS = HOMEPAGE_BESTSELLER_SLUGS.map((slug) => {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) throw new Error(`Bestseller slug "${slug}" not found in PRODUCTS`);
  return product;
});

export const TIERS: Tier[] = [
  {
    variant: "standard",
    flag: "Most chosen",
    eyebrow: "Standard",
    name: "Sculpt Member",
    price: "£100",
    period: "/ month",
    strap: "For monthly cadence. Three month minimum, then rolling.",
    list: [
      "**One Sculpt Signature workout** included each month, redeemed in the same calendar month.",
      "20% off additional workouts and boosters.",
      "10% off the shop, every order.",
      "Priority booking, two weeks ahead of the public diary.",
      "Annual photographic review at twelve months.",
    ],
    ctaLabel: "Join Standard, £100/mo",
    ctaHref: "mailto:team@thewellnesslondon.com?subject=FaceSculpt%20Standard%20membership",
  },
  {
    variant: "plus",
    eyebrow: "Plus · For deeper cadence",
    name: "Sculpt Plus",
    price: "£250",
    period: "/ month",
    strap: "For fortnightly cadence and a single dedicated therapist. Three month minimum.",
    list: [
      "**Two Sculpt Signature workouts** included each month.",
      "25% off additional workouts and boosters.",
      "15% off the shop, every order.",
      "Priority booking, four weeks ahead.",
      "Dedicated therapist across the year.",
      "Annual review with the founding doctor.",
    ],
    ctaLabel: "Enquire about Plus, £250/mo",
    ctaHref: "mailto:team@thewellnesslondon.com?subject=FaceSculpt%20Plus%20membership",
  },
];

export const WORKOUTS_FAQ: FAQ[] = [
  { q: "When can I book?", a: "The diary opens weekly, every Monday at nine. Members see the diary fourteen days ahead of the public window." },
  { q: "How does payment work?", a: "Payment is taken at booking via Stripe. The studio confirms the time inside one working day. If we cannot fit you in, the full amount is refunded automatically." },
  { q: "What if I want to reschedule?", a: "Reschedule free up to twenty four hours before. Inside that window, the full price applies. Members have one free same-day rebook each month." },
  { q: "Will it hurt?", a: "No. Microcurrent runs below the threshold of perception for most clients. EMS is felt as a firm tightening, not pain. Manual work is firm, not deep tissue." },
  { q: "Is there downtime?", a: "None. Makeup may be reapplied immediately and clients return to work. Some have a faint flush across the cheek for an hour afterwards." },
  { q: "Which workouts are pregnancy-safe?", a: "Sculpt Hands from the second trimester. Cryo Glow is not safe during pregnancy. Microcurrent and EMS workouts are not run during pregnancy." },
  { q: "Who should not book?", a: "Anyone with a pacemaker or implanted electrical device should not have microcurrent or EMS. We do not treat over active acne, open lesions or rosacea flares. Two weeks must pass after Botox, four weeks after filler." },
  { q: "Do you offer injectables?", a: "Not at FaceSculpt. Injectable services are run separately at The Wellness on Portman Square by the medical team." },
];

export const ABOUT_FAQ: FAQ[] = [
  { q: "Are you the same as The Wellness?", a: "FaceSculpt is the facial sculpting practice at The Wellness. The two share a building and a clinical standard. They do not share treatment rooms or staff. Medical, blood testing and aesthetic services are run separately by the medical team on the floors above." },
  { q: "Are the therapists clinically supervised?", a: "Yes. Each therapist works under clinician oversight from the medical team at The Wellness. Contraindications are reviewed at session one. Pacemaker, implanted electrical device and pregnancy declarations are recorded against the file." },
  { q: "Where are you based?", a: "10 Portman Square, Marylebone, London W1H 6AZ. Three minutes from Marble Arch, five minutes from Bond Street. Monday to Saturday, 09:00 to 19:00." },
  { q: "What does AI-tracked actually mean?", a: "Standardised photographs are taken at session one, session four and on the annual member review. The images are run through a guided assessment that records six symmetry markers, three muscular-tension areas and two skin-condition scores. The output is logged against your file and reviewed in writing." },
  { q: "Who owns the photographic record?", a: "You do. The record is held against your file and is available on request inside two working days. Withdrawal of consent for the record is honoured at any point." },
  { q: "Do you franchise?", a: "Not at present. The studio is one site, run by the founders and three therapists in rotation. Plans for a second site are reviewed annually." },
];

export const MEMBERSHIP_FAQ: FAQ[] = [
  { q: "What is the minimum commitment?", a: "Three months on both tiers. After that, membership rolls month to month and can be cancelled with thirty days notice." },
  { q: "Does my monthly workout roll over?", a: "No. Membership credit must be used inside the calendar month. The studio diary opens two weeks ahead for Standard members and four weeks ahead for Plus members, so the credit is rarely lost in practice." },
  { q: "Can I freeze my membership?", a: "After the three month minimum, yes. Up to two months frozen per year, with fifteen days notice. The freeze is unpaid and pauses the renewal date." },
  { q: "Do member rates apply at the shop online?", a: "Yes. Sign in to the member account at checkout and the rate is applied automatically. The member rate is excluded on gift vouchers and on items already in the seasonal sale." },
  { q: "Can I gift my workout to someone else?", a: "No. Member workouts are not transferable. Gift vouchers are sold separately on the shop." },
  { q: "Can I switch between Standard and Plus?", a: "Yes, both ways, with thirty days notice. Switching down to Standard takes effect at the next renewal. Switching up to Plus takes effect immediately, prorated." },
  { q: "What happens at twelve months?", a: "The annual photographic review is scheduled at the same time as your monthly session. The comparative file is reviewed in writing and saved to your record. No additional charge." },
  { q: "How is the price reviewed?", a: "Membership pricing is reviewed annually. Members on the rolling membership are written to thirty days before any change, and may cancel inside that window without penalty." },
];

export const EXPECT_STEPS = [
  { num: "00 · Assess", name: "AI-guided assessment", desc: "Standardised photographs and a guided assessment. Facial symmetry, muscular tension, skin condition, saved to your file at session one.", image: "/lifestyle/expect-assess.jpg" },
  { num: "01 · Prep", name: "Cleanse and warm", desc: "Double cleanse, conductive prep. Knuckling along the lymphatic chain to wake the system. Single-use consumables, every contact point.", image: "/lifestyle/expect-prep.jpg" },
  { num: "02 · Sculpt", name: "Manual and microcurrent", desc: "Hands and stone work the lift lines. Microcurrent runs in held positions for muscle re-education. Sequenced to the day's findings.", image: "/lifestyle/expect-sculpt.jpg" },
  { num: "03 · Finish", name: "Recovery and protocol", desc: "Recovery mask, finishing oils. A written protocol card with the home routine specific to the day's assessment.", image: "/lifestyle/expect-finish.jpg" },
];

export const TEAM = [
  { name: "Lead therapist", role: "Manual lymphatic, microcurrent, EMS", bio: "Eight years inside London facial practices, trained on Synergy lymphatic drainage and Ziip microcurrent. Runs the protocol training and signs off every Sculpt course at session four.", image: "/lifestyle/workout-signature.jpg" },
  { name: "Therapist two", role: "Sculpt Hands · Pregnancy-safe", bio: "CIDESCO-trained. Runs Sculpt Hands and the manual elements of Sculpt Signature. Lead on the studio's pregnancy and post-natal protocols.", image: "/lifestyle/workout-hands.jpg" },
  { name: "Therapist three", role: "EMS Lift Intensive", bio: "Sports therapy background, four years in facial EMS. Runs the EMS Lift Intensive and the Jaw EMS booster. Trained on faradic, interferential and TENS protocols.", image: "/lifestyle/workout-ems.jpg" },
];

export const FOUNDERS = [
  { name: "Omar", role: "Co-founder · The Wellness, FaceSculpt", bio: "Doctor by training, GMC registered. MD, BSc and MPH from Harvard. AI research at Oxford. Co-founded The Wellness on Portman Square in 2024 to run a different model of private healthcare in London. FaceSculpt is the facial sculpting line of that practice." },
  { name: "Sofian", role: "Co-founder · The Wellness, FaceSculpt", bio: "Engineer by training, twenty five years building software inside healthcare and consumer brands. Runs the technology and operations side of The Wellness. Built the photographic record system that runs every FaceSculpt session." },
];

export const HOW_STEPS = [
  { num: "01 · Sign up", title: "Sign up online", text: "Subscribe via Stripe. First month is charged at signup; the studio confirms session one inside one working day." },
  { num: "02 · First session", title: "Book session one", text: "Inside seven days of joining. Photographs and biometric assessment taken at session one, saved to your file." },
  { num: "03 · Cadence", title: "One workout each month", text: "Booked via the member diary. Sculpt Signature included, redeem in the calendar month." },
  { num: "04 · Review", title: "Annual review", text: "Twelve months in, comparative photographs and assessment are taken. The full record is reviewed in writing." },
];
