import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import { signup } from "../lib/api.js";
import { alertError, inputClass, labelClass, primaryBtn } from "../lib/uiClasses.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== verifyPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({ fullName, email, password });
      navigate("/login", {
        replace: true,
        state: { message: "Account created. Sign in with your email and password." },
      });
    } catch (err) {
      setError(err.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save word insights to your notebook across devices."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-ep-ink underline-offset-2 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? (
          <div className={alertError} role="alert">
            {error}
          </div>
        ) : null}

        <div>
          <label htmlFor="signup-name" className={labelClass}>
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClass}>
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className={labelClass}>
            Password
          </label>
          <input
            id="signup-password"
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
          <label htmlFor="signup-verify" className={labelClass}>
            Verify password
          </label>
          <input
            id="signup-verify"
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
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
