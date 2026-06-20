import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import { login } from "../lib/api.js";
import { alertError, alertSuccess, inputClass, labelClass, primaryBtn } from "../lib/uiClasses.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(location.state?.returnTo ?? "/study", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue studying with your saved notebook."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold text-ep-ink underline-offset-2 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {successMessage ? (
          <div className={alertSuccess} role="status">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className={alertError} role="alert">
            {error}
          </div>
        ) : null}

        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="login-password" className={labelClass}>
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-ep-muted underline-offset-2 hover:text-ep-ink hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button type="submit" disabled={submitting} className={primaryBtn}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
