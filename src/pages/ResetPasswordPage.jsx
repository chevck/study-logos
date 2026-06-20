import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import { resetPassword } from "../lib/api.js";
import { alertError, inputClass, labelClass, primaryBtn } from "../lib/uiClasses.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing a token. Request a new reset email.");
      return;
    }
    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await resetPassword({ token, password });
      navigate("/login", {
        replace: true,
        state: {
          message: data.message || "Your password has been reset. Sign in with your new password.",
        },
      });
    } catch (err) {
      setError(err.message || "Could not reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This link is missing a reset token."
        footer={
          <Link to="/forgot-password" className="font-bold text-ep-ink underline-offset-2 hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <p className="text-sm font-medium text-ep-muted">
          Password reset links expire after one hour. Request a fresh link from the forgot password page.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter and confirm your new password below."
      footer={
        <Link to="/login" className="font-bold text-ep-ink underline-offset-2 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? (
          <div className={alertError} role="alert">
            {error}
          </div>
        ) : null}

        <div>
          <label htmlFor="reset-password" className={labelClass}>
            New password
          </label>
          <input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="reset-verify" className={labelClass}>
            Verify new password
          </label>
          <input
            id="reset-verify"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={inputClass}
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" disabled={submitting} className={primaryBtn}>
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}
