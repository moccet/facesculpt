"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AccountModal.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Status = "idle" | "loading" | "notfound" | "error";

export function AccountModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setEmail("");
      setStatus("idle");
      setMessage("");
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      e.preventDefault();
      onClose();
    }
    function onClosed() {
      onClose();
    }
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClosed);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClosed);
    };
  }, [onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading" || !email) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        found?: boolean;
        url?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong, try again.");
        return;
      }
      if (data.found && data.url) {
        // Redirect straight to the Stripe Customer Portal.
        window.location.href = data.url;
        return;
      }
      setStatus("notfound");
      setMessage(
        data.message ??
          "We couldn't find a membership tied to that email. Become a member or call the studio if this is a mistake.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error — try again.");
    }
  }

  function onDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Account access"
      onClick={onDialogClick}
    >
      <div className={styles.body}>
        <div className={styles.eyebrow}>Account</div>
        <h2 className={styles.title}>Manage your membership</h2>
        <p className={styles.text}>
          Enter the email you joined with. We’ll open a secure Stripe portal where you can update your card, pause,
          or cancel.
        </p>
        <form onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="account-email">Email address</label>
            <input
              ref={inputRef}
              id="account-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
            />
          </div>
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.primary}
              disabled={status === "loading" || !email}
            >
              {status === "loading" ? "Opening…" : "Open my account"}
            </button>
            <button type="button" className={styles.secondary} onClick={onClose}>
              Cancel
            </button>
          </div>
          {message && (
            <p
              className={`${styles.message} ${
                status === "error" ? styles.error : styles.notice
              }`}
              role={status === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </dialog>
  );
}
