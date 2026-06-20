import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      <header className="ep-header-bar px-4 py-4 sm:px-6">
        <Link to="/" className="inline-block">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="ep-surface-card p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-ep-ink">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm font-medium leading-relaxed text-ep-muted">
                {subtitle}
              </p>
            ) : null}
          </div>
          {children}
        </div>
        {footer ? (
          <p className="mt-6 text-center text-sm font-medium text-ep-muted">
            {footer}
          </p>
        ) : null}
      </main>
    </div>
  );
}
