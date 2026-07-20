"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ToastProvider";

export default function AdminLoginForm() {
  const router = useRouter();
  const { notify } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      notify({
        title: "Sign-in failed",
        message: result.error ?? "Invalid credentials.",
        tone: "error",
      });
      setSubmitting(false);
      return;
    }

    notify({
      title: "Welcome back",
      message: "Signed in successfully.",
      tone: "success",
    });
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label>
        Admin email
        <input name="email" type="email" autoComplete="username" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </label>
      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
