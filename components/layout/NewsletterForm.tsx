"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./NewsletterForm.module.css";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const id = useId();
  const pathname = usePathname() || "/";
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `footer:${pathname}`, _hp: hp }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.label}>
        {status === "success"
          ? "Thanks — you're on the list."
          : status === "error"
            ? "Something went wrong. Please try again."
            : "Be the first to know"}
      </div>
      {status !== "success" && (
        <div className={styles.row}>
          <label htmlFor={id} className={styles.hidden}>Email</label>
          <input
            type="email"
            id={id}
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            required
            disabled={status === "loading"}
          />
          {/* honeypot — hidden from real users, bots fill it */}
          <input
            type="text"
            name="_hp"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className={styles.hidden}
            aria-hidden="true"
          />
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Sign up"}
          </button>
        </div>
      )}
    </form>
  );
}
