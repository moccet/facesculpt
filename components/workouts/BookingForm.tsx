"use client";

import { useId, useMemo, useRef, useState } from "react";
import { BOOSTERS, WORKOUTS } from "@/lib/content";
import { SectionHead } from "@/components/ui/SectionHead";
import buttonStyles from "@/components/ui/Button.module.css";
import styles from "./BookingForm.module.css";

type WorkoutOption = {
  value: string;
  name: string;
  price: number;
  duration: string;
  meta: string;
  desc: string;
  flag?: string;
};

const COURSE_OPTION: WorkoutOption = {
  value: "course",
  name: "Sculpt Course",
  price: 440,
  duration: "4 × 40 min",
  meta: "4 × 40 min · Eight weeks",
  desc: "Four Sculpt Signature workouts, fortnightly. Photographic record.",
};

const BOOK_OPTIONS: WorkoutOption[] = [
  ...WORKOUTS.map((w) => ({
    value: w.bookValue,
    name: w.name,
    price: w.price,
    duration: w.durationLabel,
    meta: w.meta,
    desc: w.desc,
    flag: w.flag,
  })),
  COURSE_OPTION,
];

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookingForm() {
  const id = useId();
  const [workout, setWorkout] = useState<string>("");
  const [boosters, setBoosters] = useState<Set<string>>(new Set());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const startedFiredRef = useRef(false);

  const selectedWorkout = BOOK_OPTIONS.find((w) => w.value === workout);
  const selectedBoosters = BOOSTERS.filter((b) => boosters.has(b.slug));

  const total = useMemo(
    () => (selectedWorkout?.price ?? 0) + selectedBoosters.reduce((s, b) => s + b.price, 0),
    [selectedWorkout, selectedBoosters],
  );

  function toggleBooster(slug: string) {
    setBoosters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  /**
   * Fire booking-started exactly once per page mount, the first time any
   * contact field blurs while we hold a valid email. Email is the
   * minimum identifying field the endpoint requires.
   */
  async function fireStartedIfReady() {
    if (startedFiredRef.current) return;
    if (!email || !EMAIL_RE.test(email)) return;
    startedFiredRef.current = true;
    try {
      await fetch("/api/booking/started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone,
          workout: selectedWorkout?.name ?? null,
          _hp: hp,
        }),
        keepalive: true,
      });
    } catch {
      // Lead-capture is best-effort; do not surface to user
      startedFiredRef.current = false;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setErrorMsg("");
    setStatus("loading");
    try {
      const res = await fetch("/api/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          workout,
          boosters: Array.from(boosters),
          date,
          time,
          allergies,
          notes,
          _hp: hp,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(data.error ?? "Something went wrong, please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Network error, please try again.");
      setStatus("error");
    }
  }

  return (
    <section className={`${styles.wrap} section`} id="book">
      <div className={styles.inner}>
        <SectionHead
          centered
          step="Book your workout"
          title="Book a workout"
          sub="Pick your workout, optional boosters, preferred date and time. The studio confirms availability inside one working day."
        />

        {status === "success" ? (
          <div className={`${styles.form} ${styles.success}`} role="status">
            Booking request received. The studio will confirm inside one working day.
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Choose a workout</legend>
              <div className={styles.options}>
                {BOOK_OPTIONS.map((w) => {
                  const isSelected = workout === w.value;
                  return (
                    <label
                      key={w.value}
                      className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    >
                      {w.flag && <span className={styles.optionFlag}>{w.flag}</span>}
                      <input
                        type="radio"
                        name="workout"
                        value={w.value}
                        checked={isSelected}
                        onChange={() => setWorkout(w.value)}
                      />
                      <div className={styles.optionTop}>
                        <span className={styles.optionName}>{w.name}</span>
                        <span className={styles.optionPrice}>£{w.price}</span>
                      </div>
                      <div className={styles.optionMeta}>{w.meta}</div>
                      <div className={styles.optionDesc}>{w.desc}</div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Add a booster (optional)</legend>
              <div className={styles.options}>
                {BOOSTERS.map((b) => {
                  const isSelected = boosters.has(b.slug);
                  return (
                    <label
                      key={b.slug}
                      className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    >
                      <input
                        type="checkbox"
                        name="booster"
                        value={b.slug}
                        checked={isSelected}
                        onChange={() => toggleBooster(b.slug)}
                      />
                      <div className={styles.optionTop}>
                        <span className={styles.optionName}>{b.name}</span>
                        <span className={styles.optionPrice}>£{b.price}</span>
                      </div>
                      <div className={styles.optionMeta}>{b.durationLabel}</div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Preferred date and time</legend>
              <div className={`${styles.fields} ${styles.fieldsTwoCol}`}>
                <div className={styles.field}>
                  <label htmlFor={`${id}-date`}>Preferred date</label>
                  <input
                    id={`${id}-date`}
                    type="date"
                    name="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${id}-time`}>Preferred time</label>
                  <select
                    id={`${id}-time`}
                    name="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  >
                    <option value="">Pick a time</option>
                    {Array.from({ length: 10 }, (_, i) => `${(9 + i).toString().padStart(2, "0")}:00`)
                      .map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Your details</legend>
              <div className={`${styles.fields} ${styles.fieldsTwoCol}`}>
                <div className={styles.field}>
                  <label htmlFor={`${id}-fn`}>First name</label>
                  <input
                    id={`${id}-fn`}
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={fireStartedIfReady}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${id}-ln`}>Last name</label>
                  <input
                    id={`${id}-ln`}
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={fireStartedIfReady}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${id}-em`}>Email</label>
                  <input
                    id={`${id}-em`}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={fireStartedIfReady}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${id}-ph`}>Phone</label>
                  <input
                    id={`${id}-ph`}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={fireStartedIfReady}
                  />
                </div>
              </div>
              <div className={styles.fields} style={{ marginTop: 14 }}>
                <div className={styles.field}>
                  <label htmlFor={`${id}-al`}>Allergies and contraindications</label>
                  <span className={styles.fieldHelp}>
                    Pacemaker, implanted electrical device, pregnancy, recent Botox or filler, active acne, rosacea. Type none if none.
                  </span>
                  <textarea
                    id={`${id}-al`}
                    name="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor={`${id}-no`}>Anything we should know</label>
                  <textarea
                    id={`${id}-no`}
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              {/* honeypot */}
              <input
                type="text"
                name="_hp"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px" }}
              />
            </fieldset>

            {(selectedWorkout || selectedBoosters.length > 0) && (
              <div className={styles.summary}>
                <div className={styles.summaryTitle}>Your selection</div>
                {selectedWorkout && (
                  <div className={styles.summaryRow}>
                    <span>{selectedWorkout.name} · {selectedWorkout.duration}</span>
                    <span>£{selectedWorkout.price}</span>
                  </div>
                )}
                {selectedBoosters.map((b) => (
                  <div key={b.slug} className={styles.summaryRow}>
                    <span>{b.name} · {b.durationLabel}</span>
                    <span>£{b.price}</span>
                  </div>
                ))}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>£{total}</span>
                </div>
              </div>
            )}

            <div className={styles.submitRow}>
              <button
                type="submit"
                className={`${buttonStyles.btn} ${buttonStyles.dark}`}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Submitting…" : "Submit request"}
              </button>
              {status === "error" && (
                <p className={styles.note} role="alert" style={{ color: "#b00020" }}>
                  {errorMsg}
                </p>
              )}
              <p className={styles.note}>
                A submitted request is held until the studio confirms availability inside one working day. No card is
                charged at this point.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
