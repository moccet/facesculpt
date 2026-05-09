"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/quiz";
import type { Question } from "@/lib/quiz";
import { LEARNINGS, recommend, type Answers } from "@/lib/recommend";
import { STUDIO } from "@/lib/content";
import styles from "./Assessment.module.css";

type Phase =
  | { kind: "welcome" }
  | { kind: "q"; index: number }
  | { kind: "learn"; index: number }
  | { kind: "lead" }
  | { kind: "compute" }
  | { kind: "result" };

const TOTAL_Q = QUESTIONS.length;
const TRANSITION_MS = 350;

export function Assessment() {
  const [phase, setPhase] = useState<Phase>({ kind: "welcome" });
  const [answers, setAnswers] = useState<Answers>({});
  const computeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formId = useId();

  // ---------- progress / counter ----------
  const progressPct = useMemo(() => {
    if (phase.kind === "welcome") return 0;
    if (phase.kind === "q") return ((phase.index + 1) / TOTAL_Q) * 88;
    if (phase.kind === "learn") return ((phase.index + 1) / TOTAL_Q) * 88 + 2;
    if (phase.kind === "lead") return 92;
    if (phase.kind === "compute") return 96;
    return 100;
  }, [phase]);

  const counter = phase.kind === "q" ? `Question ${phase.index + 1} of ${TOTAL_Q}` : "";

  // ---------- transitions ----------
  const goNext = useCallback(() => {
    setPhase((p) => {
      if (p.kind === "welcome") return { kind: "q", index: 0 };
      if (p.kind === "q") {
        const key = QUESTIONS[p.index].key;
        if (!answers[key]) return p; // don't advance without an answer
        return { kind: "learn", index: p.index };
      }
      if (p.kind === "learn") {
        if (p.index + 1 < TOTAL_Q) return { kind: "q", index: p.index + 1 };
        return { kind: "lead" };
      }
      // lead/compute/result advance via dedicated handlers
      return p;
    });
  }, [answers]);

  const goPrev = useCallback(() => {
    setPhase((p) => {
      if (p.kind === "q" && p.index > 0) return { kind: "learn", index: p.index - 1 };
      if (p.kind === "learn") return { kind: "q", index: p.index };
      if (p.kind === "lead") return { kind: "learn", index: TOTAL_Q - 1 };
      return p;
    });
  }, []);

  function selectOption(q: Question, value: string) {
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    // brief hold so user sees the check animation, then advance
    setTimeout(() => {
      setPhase({ kind: "learn", index: QUESTIONS.findIndex((x) => x.key === q.key) });
    }, 380);
  }

  function submitLead(e?: React.FormEvent) {
    e?.preventDefault();
    setPhase({ kind: "compute" });
    // Fire and forget — Slack notification is best-effort, the user
    // experience must not depend on it. Reveal the result either way.
    const { name, email, phone, ...answersOnly } = answers;
    fetch("/api/assessment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, answers: answersOnly }),
      keepalive: true,
    }).catch((err) => console.error("[assessment] submit failed:", err));
    computeTimer.current = setTimeout(() => setPhase({ kind: "result" }), 1800);
  }

  useEffect(() => () => {
    if (computeTimer.current) clearTimeout(computeTimer.current);
  }, []);

  // ---------- keyboard ----------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      if (e.key === "Enter") {
        if (inField && (target as HTMLInputElement).type !== "checkbox") return;
        e.preventDefault();
        if (phase.kind === "lead") submitLead();
        else if (phase.kind === "welcome" || phase.kind === "learn") goNext();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (phase.kind === "welcome" || phase.kind === "learn") goNext();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (phase.kind === "q") {
        const letter = e.key.toUpperCase();
        if (/^[A-F]$/.test(letter)) {
          const idx = letter.charCodeAt(0) - 65;
          const q = QUESTIONS[phase.index];
          const opt = q.options[idx];
          if (opt) selectOption(q, opt.value);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, goNext, goPrev]);

  // ---------- result derivation ----------
  const recommendation = phase.kind === "result" ? recommend(answers) : null;
  const whatsappHref = useMemo(() => {
    if (!recommendation) return STUDIO.whatsapp;
    const firstName = answers.name ? answers.name.split(" ")[0] : "";
    const greeting = firstName ? `Hi, I'm ${firstName}.` : "Hi.";
    const msg = `${greeting} I've completed the FaceSculpt assessment, my recommended workout is ${recommendation.workout}. When can I book?`;
    return `${STUDIO.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [recommendation, answers.name]);

  // ---------- helpers for screens ----------
  const isWelcome = phase.kind === "welcome";
  const isResult = phase.kind === "result";
  const navUpDisabled = phase.kind === "welcome" || phase.kind === "compute" || phase.kind === "result" || (phase.kind === "q" && phase.index === 0);
  const navDownDisabled = phase.kind === "compute" || phase.kind === "result" || (phase.kind === "q" && !answers[QUESTIONS[phase.index].key]);

  return (
    <div className={styles.root}>
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      <header className={styles.header}>
        <div className={styles.wordmark}>
          <span className={styles.wordmark1}>FaceSculpt</span>
          <span className={styles.wordmark2}>by <i>The Wellness</i></span>
        </div>
        <div className={`${styles.qCounter} ${counter ? "" : styles.hidden}`}>
          {counter}
        </div>
      </header>

      <div className={styles.main}>
        {/* WELCOME */}
        <Screen active={isWelcome} transitionMs={TRANSITION_MS}>
          <div className={styles.welcomeEyebrow}>Free, ninety seconds</div>
          <h1 className={styles.welcomeTitle}>The assessment</h1>
          <p className={styles.welcomeSub}>
            Eight questions, the same intake the studio runs at session one. You leave with a recommended workout, a
            home protocol, and three ways to book.
          </p>
          <button type="button" className={styles.primaryBtn} onClick={goNext}>
            Begin
            <ArrowRight />
          </button>
        </Screen>

        {/* QUESTIONS */}
        {QUESTIONS.map((q, i) => (
          <Screen key={`q-${q.key}`} active={phase.kind === "q" && phase.index === i} transitionMs={TRANSITION_MS}>
            <div>
              <span className={styles.qPrefix}>
                {q.number}
                <svg viewBox="0 0 10 10"><path d="M3 3l4 2-4 2z" fill="currentColor" /></svg>
              </span>
              <span className={styles.questionText}>{q.text}</span>
            </div>
            {q.helper && <p className={styles.questionHelper}>{q.helper}</p>}
            <div className={styles.options}>
              {q.options.map((opt, j) => {
                const isSelected = answers[q.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={() => selectOption(q, opt.value)}
                  >
                    <div className={styles.optionRow}>
                      <span className={styles.optionLetter}>
                        {String.fromCharCode(65 + j)}
                      </span>
                      <span className={styles.optionText}>{opt.label}</span>
                      <span className={styles.optionCheck}>
                        <svg viewBox="0 0 14 14"><path d="M3 7l3 3 5-7" /></svg>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Screen>
        ))}

        {/* LEARNINGS */}
        {QUESTIONS.map((q, i) => {
          const value = answers[q.key];
          const text = value ? LEARNINGS[q.key]?.[value] : undefined;
          return (
            <Screen
              key={`l-${q.key}`}
              active={phase.kind === "learn" && phase.index === i}
              transitionMs={TRANSITION_MS}
            >
              <p className={styles.learnText}>{text}</p>
              <div className={styles.learnActions}>
                <button type="button" className={styles.primaryBtn} onClick={goNext}>
                  Continue
                  <ArrowRight />
                </button>
                <span className={styles.okHint}>press <kbd>Enter</kbd></span>
              </div>
            </Screen>
          );
        })}

        {/* LEAD */}
        <Screen active={phase.kind === "lead"} transitionMs={TRANSITION_MS}>
          <div className={styles.leadFlag}>Almost there</div>
          <h2 className={styles.leadTitle}>Where shall we send your plan?</h2>
          <p className={styles.leadSub}>
            Sent to your inbox and viewable on the next screen. Phone is for booking confirmation only, never marketing.
          </p>
          <form className={styles.leadForm} onSubmit={submitLead}>
            <div className={styles.leadField}>
              <label htmlFor={`${formId}-name`}>First name</label>
              <input
                id={`${formId}-name`}
                type="text"
                required
                autoComplete="given-name"
                placeholder="First name"
                value={answers.name ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
              />
            </div>
            <div className={styles.leadField}>
              <label htmlFor={`${formId}-email`}>Email address</label>
              <input
                id={`${formId}-email`}
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={answers.email ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
              />
            </div>
            <div className={styles.leadField}>
              <label htmlFor={`${formId}-phone`}>Phone, also for WhatsApp</label>
              <input
                id={`${formId}-phone`}
                type="tel"
                required
                autoComplete="tel"
                placeholder="+44 7700 900000"
                value={answers.phone ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
              />
            </div>
            <label className={styles.leadCheckbox}>
              <input type="checkbox" required />
              <span>I&apos;d like FaceSculpt to send my plan and follow up about booking. I can opt out at any time.</span>
            </label>
            <div className={styles.leadActions}>
              <button type="submit" className={styles.primaryBtn}>
                View my plan
                <ArrowRight />
              </button>
            </div>
          </form>
        </Screen>

        {/* COMPUTE */}
        <Screen
          active={phase.kind === "compute"}
          transitionMs={TRANSITION_MS}
          className={styles.computeScreen}
        >
          <div className={styles.computeMark}>Building your plan</div>
          <h2 className={styles.computeTitle}>Reading your eight answers.</h2>
          <p className={styles.computeSub}>
            Matching to the studio&apos;s clinical pathway and the boutique inventory.
          </p>
          <div className={styles.computeLoader} />
        </Screen>

        {/* RESULT */}
        <Screen active={isResult} transitionMs={TRANSITION_MS} className={styles.screenResult}>
          {recommendation && (
            <>
              <div className={styles.resultFlag}>Your plan</div>
              <p className={styles.resultPre}>{recommendation.preLine}</p>
              <h2 className={styles.resultWorkout}>{recommendation.workout}</h2>
              <p className={styles.resultMeta}>{recommendation.meta}</p>

              <div className={styles.resultCtaRow}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.primaryBtn} ${styles.primaryBtnLg}`}
                >
                  Book now on WhatsApp
                  <ArrowRight />
                </a>
                <a href={STUDIO.phoneHref} className={styles.secondaryLink}>
                  or call 020 3951 3429
                </a>
              </div>

              <div className={styles.resultBlock}>
                <h3>Why this is right for you</h3>
                <div className={styles.resultReasoning}>
                  {recommendation.reasoning.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>

              {recommendation.boosters.length > 0 && (
                <div className={styles.resultBlock}>
                  <h3>Add this to your session</h3>
                  <ul className={styles.list}>
                    {recommendation.boosters.map((b, i) => (
                      <li key={i} className={styles.listItem}>
                        <strong>
                          {b.name}
                          <span style={{ color: "var(--ink-2)", fontWeight: 400, marginLeft: 8, fontSize: 12 }}>
                            {b.meta}
                          </span>
                        </strong>
                        <span>{b.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.resultBlock}>
                <h3>Your home protocol alongside the studio</h3>
                <p className={styles.resultReasoning} style={{ marginBottom: 14 }}>
                  {recommendation.protocolText}
                </p>
                <ul className={styles.list}>
                  {recommendation.protocol.map((p, i) => (
                    <li key={i} className={styles.listItem}>
                      <strong>{p.name}</strong>
                      <span>{p.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.resultBlock}>
                <h3>Three ways to book</h3>
                <div className={styles.bookGrid}>
                  <a href={STUDIO.phoneHref} className={styles.bookCard}>
                    <span className={styles.bookCardLabel}>Call the studio</span>
                    <span className={styles.bookCardValue}>020 3951 3429</span>
                  </a>
                  <a href={`${STUDIO.emailHref}?subject=FaceSculpt%20booking`} className={styles.bookCard}>
                    <span className={styles.bookCardLabel}>Email</span>
                    <span className={styles.bookCardValue}>{STUDIO.email}</span>
                  </a>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.bookCard}>
                    <span className={styles.bookCardLabel}>WhatsApp Henry</span>
                    <span className={styles.bookCardValue}>07961 280835</span>
                  </a>
                </div>
                <div className={styles.studioInfo}>
                  <strong>The studio</strong>
                  10 Portman Square, Marylebone, W1H 6AZ. Monday to Saturday, 09:00 to 19:00.
                </div>
              </div>

              <div className={styles.adviceBlock}>
                <div className={styles.adviceTitle}>Start tonight</div>
                <p className={styles.adviceSub}>
                  Three moves you can start today. The studio plan compounds these.
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <strong>Take a baseline photograph tonight</strong>
                    <span>
                      Same window, same light, three angles (front, left forty-five, right forty-five). Save with
                      today&apos;s date. Twelve weeks from now, this is the only fair comparison you&apos;ll have.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <strong>Tomorrow morning, daily SPF starts</strong>
                    <span>
                      Broad-spectrum, SPF 30 minimum, a teaspoon for face and neck. The single most evidence-backed
                      anti-ageing decision in skincare. Reapply if you&apos;re outside past midday.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <strong>Wednesday, introduce a low-strength retinoid</strong>
                    <span>
                      Three evenings a week to start, on dry skin twenty minutes after cleansing. Build to nightly
                      over six to twelve weeks. Pair with morning SPF without exception.
                    </span>
                  </li>
                </ul>
              </div>

              {answers.email && (
                <div className={styles.resultConfirm}>
                  Plan emailed to{" "}
                  <span className={styles.resultEmail}>{answers.email}</span>. Studio replies within one working day if
                  you&apos;d like to talk it through before booking.
                </div>
              )}
            </>
          )}
        </Screen>
      </div>

      <footer className={`${styles.brandFooter} ${isResult ? styles.hidden : ""}`}>
        Powered by <span className={styles.brandFooterMark}>FaceSculpt</span>
      </footer>

      <div className={`${styles.navArrows} ${isWelcome || isResult ? styles.hidden : ""}`}>
        <button
          type="button"
          className={styles.navArrow}
          onClick={goPrev}
          disabled={navUpDisabled}
          aria-label="Previous"
        >
          <svg viewBox="0 0 14 14"><path d="M3 9l4-4 4 4" /></svg>
        </button>
        <button
          type="button"
          className={styles.navArrow}
          onClick={goNext}
          disabled={navDownDisabled}
          aria-label="Next"
        >
          <svg viewBox="0 0 14 14"><path d="M3 5l4 4 4-4" /></svg>
        </button>
      </div>
    </div>
  );
}

function Screen({
  active,
  className,
  children,
  transitionMs,
}: {
  active: boolean;
  className?: string;
  children: React.ReactNode;
  transitionMs: number;
}) {
  // mount briefly after active flips off so transition can play; here we just toggle classes
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active && ref.current) {
      // ensure scrolled to top on result screen
      ref.current.scrollTop = 0;
    }
  }, [active]);
  return (
    <section
      ref={ref}
      className={`${styles.screen} ${active ? styles.screenActive : ""} ${className ?? ""}`}
      style={{ transitionDuration: `${transitionMs}ms` }}
      aria-hidden={!active}
    >
      <div className={styles.screenInner}>{children}</div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7h8M7 3l4 4-4 4" />
    </svg>
  );
}
