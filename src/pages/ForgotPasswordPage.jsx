import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import { requestPasswordReset } from "../lib/api.js";
import { alertError, alertSuccess, inputClass, labelClass, primaryBtn } from "../lib/uiClasses.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl("");
    setSubmitting(true);

    try {
      const data = await requestPasswordReset({ email });
      setMessage(
        data.message ||
          "If an account exists for that email, we sent password reset instructions.",
      );
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError(err.message || "Could not send reset instructions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email on your account and we'll send reset instructions."
      footer={
        <>
          Remember your password?{" "}
          <Link to="/login" className="font-bold text-ep-ink underline-offset-2 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {message ? (
        <div className="flex flex-col gap-4">
          <div className={alertSuccess} role="status">
            {message}
          </div>
          {devResetUrl ? (
            <div className="rounded-2xl border border-ep-line/90 bg-ep-surface/80 px-4 py-3 text-sm text-ep-muted">
              <p className="font-semibold text-ep-ink">Development reset link</p>
              <a
                href={devResetUrl}
                className="mt-2 block break-all font-medium text-ep-accent underline-offset-2 hover:underline"
              >
                {devResetUrl}
              </a>
            </div>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? (
            <div className={alertError} role="alert">
              {error}
            </div>
          ) : null}

          <div>
            <label htmlFor="forgot-email" className={labelClass}>
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={submitting} className={primaryBtn}>
            {submitting ? "Sending…" : "Send reset instructions"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
