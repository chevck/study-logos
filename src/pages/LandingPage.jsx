import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import AppIcon from "../components/AppIcon.jsx";
import UserAvatarMenu from "../components/UserAvatarMenu.jsx";
import RevealOnScroll from "../components/landing/RevealOnScroll.jsx";
import { clearAuth, fetchSessionUser, getAuthToken, getAuthUser } from "../lib/api.js";
import { getThemePreference } from "../lib/authStorage.js";
import { applyTheme, normalizeTheme } from "../lib/theme.js";
import { ghostBtn } from "../lib/uiClasses.js";

const IMAGES = {
  wordInsight: "/landing/word-insight.jpg",
  notebook: "/landing/notebook.jpg",
  editions: "/landing/editions.jpg",
  studyScene: "/landing/study-scene.jpg",
};

const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-ep-accent px-6 py-3 text-sm font-bold tracking-tight text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover hover:scale-[1.02] active:scale-[0.98]";

const primaryBtnDark =
  "inline-flex items-center justify-center rounded-full bg-ep-accent px-6 py-3 text-sm font-bold tracking-tight text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover";

const outlineBtn =
  "inline-flex items-center justify-center rounded-full border-2 border-ep-ink/15 bg-transparent px-6 py-3 text-sm font-bold tracking-tight text-ep-ink transition hover:border-ep-ink/30 hover:bg-ep-surface-panel";

const sectionLabel =
  "text-[11px] font-extrabold uppercase tracking-[0.18em] text-ep-muted";

const NAV_LINKS = [
  ["#features", "Features"],
  ["#approach", "Our approach"],
  ["#editions", "Editions"],
  ["#notebook", "Notebook"],
];

function IconBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
    </svg>
  );
}

function IconLink(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  );
}

function IconNotebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M4 4h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  );
}

function IconComment(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ep-accent" aria-hidden>
      <path
        fill="currentColor"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      />
    </svg>
  );
}

function Nav() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(() => getAuthUser());
  const [sessionChecked, setSessionChecked] = useState(() => !getAuthToken());

  useEffect(() => {
    if (!getAuthToken()) {
      setAuthUser(null);
      setSessionChecked(true);
      return;
    }

    let cancelled = false;
    fetchSessionUser()
      .then((data) => {
        if (!cancelled) setAuthUser(data.user ?? getAuthUser());
      })
      .catch(() => {
        if (!cancelled) {
          clearAuth();
          setAuthUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setSessionChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(() => {
    clearAuth();
    setAuthUser(null);
    applyTheme(normalizeTheme(getThemePreference()));
    navigate("/", { replace: true });
  }, [navigate]);

  const isLoggedIn = Boolean(authUser);

  return (
    <header className="landing-nav sticky top-0 z-50 border-b border-ep-line/30 bg-ep-surface-panel/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav
          aria-label="Landing navigation"
          className="mx-auto hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ep-muted transition hover:bg-ep-surface-muted hover:text-ep-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {sessionChecked && isLoggedIn ? (
            <UserAvatarMenu user={authUser} onSignOut={handleSignOut} />
          ) : sessionChecked ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ep-muted transition hover:text-ep-ink sm:inline-flex"
              >
                Sign in
              </Link>
              <Link to="/signup" className={primaryBtnDark}>
                Get started
              </Link>
            </>
          ) : (
            <div
              className="h-10 w-10 rounded-full bg-ep-surface-muted animate-pulse"
              aria-hidden
            />
          )}
        </div>
      </div>
    </header>
  );
}

function HeroShowcase() {
  return (
    <RevealOnScroll className="landing-hero-showcase">
      <div className="landing-hero-showcase-glow pointer-events-none absolute -inset-6 sm:-inset-10" aria-hidden />
      <div className="landing-hero-showcase-orb landing-hero-showcase-orb-a pointer-events-none absolute -left-6 top-8 h-28 w-28 rounded-full bg-ep-accent/30 blur-2xl" aria-hidden />
      <div className="landing-hero-showcase-orb landing-hero-showcase-orb-b pointer-events-none absolute -right-4 bottom-16 h-32 w-32 rounded-full bg-ep-glow/50 blur-2xl" aria-hidden />

      <div className="landing-hero-mockup-frame relative rounded-[1.5rem] p-[3px]">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-ep-surface-panel shadow-card-lg landing-hero-mockup">
          <div className="landing-mockup-chrome flex items-center gap-3 border-b border-ep-accent/20 px-4 py-3 sm:px-5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
              <AppIcon variant="gold" className="h-4 w-4 shrink-0" alt="" />
              <span className="truncate text-[11px] font-semibold text-white/75">
                studylogos.app/study · John 1:1 · NKJV
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="landing-mockup-scripture relative border-b border-ep-line/40 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <span className="landing-mockup-watermark landing-mockup-watermark-greek" aria-hidden>
                α
              </span>
              <p className="relative text-[10px] font-extrabold uppercase tracking-[0.16em] text-ep-accent">
                Scripture
              </p>
              <p className="relative mt-3 font-sans text-base font-medium leading-[1.75] text-ep-ink sm:text-lg sm:leading-[1.8]">
                In the beginning was{" "}
                <span className="landing-mockup-word landing-mockup-word-active">
                  the Word
                </span>
                , and{" "}
                <span className="landing-mockup-word">the Word</span> was with God,
                and{" "}
                <span className="landing-mockup-word">the Word</span> was God.
              </p>
              <p className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-ep-accent/25 bg-ep-surface-panel/80 px-3 py-1 text-xs font-semibold text-ep-subtle backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-ep-accent animate-pulse-soft" aria-hidden />
                Tap a highlighted phrase to study
              </p>
            </div>

            <div className="landing-mockup-breakdown relative p-5 sm:p-6">
              <span className="landing-mockup-watermark landing-mockup-watermark-hebrew" aria-hidden>
                ω
              </span>
              <p className="relative text-[10px] font-extrabold uppercase tracking-[0.16em] text-ep-accent">
                Breakdown
              </p>
              <p className="relative mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                the Word
              </p>
              <p className="relative mt-0.5 text-xs font-semibold text-white/55">John 1:1</p>

              <div className="relative mt-4 overflow-hidden rounded-xl border border-ep-accent/35 bg-[#1c1a16]/80 p-3.5 shadow-soft backdrop-blur-sm">
                <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-ep-accent/20 blur-xl" aria-hidden />
                <p className="relative text-lg font-bold text-ep-accent">λόγος</p>
                <p className="relative text-sm font-semibold italic text-white/70">lógos</p>
                <p className="relative mt-1 text-[10px] font-bold uppercase tracking-wider text-ep-accent/80">
                  Greek
                </p>
              </div>

              <p className="relative mt-3 text-sm font-medium leading-relaxed text-white/65">
                Reason, speech, divine expression — the same word John uses for Christ
                as the revealer of the Father.
              </p>

              <div className="relative mt-4 flex flex-wrap gap-2">
                {[
                  {
                    label: "Case study",
                    className:
                      "border border-purple-400/40 bg-purple-500/15 text-purple-200",
                  },
                  {
                    label: "Cross-refs",
                    className:
                      "border border-ep-accent/50 bg-ep-accent/15 text-[#FFE8B7]",
                  },
                  {
                    label: "First mention",
                    className:
                      "border border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
                  },
                ].map(({ label, className }) => (
                  <span
                    key={label}
                    className={`landing-mockup-tag ${className}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4">
        {[
          { value: "2", label: "Original languages", sub: "Greek & Hebrew", tone: "accent" },
          { value: "3+", label: "Bible editions", sub: "NKJV · NLT · AMP", tone: "dark" },
          { value: "1-tap", label: "Word study", sub: "Instant breakdown", tone: "glow" },
          { value: "∞", label: "Notebook", sub: "Save every insight", tone: "panel" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`landing-hero-stat landing-hero-stat-${stat.tone}`}
          >
            <p className="text-xl font-extrabold tabular-nums sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-xs font-bold">{stat.label}</p>
            <p className="hidden text-[10px] font-medium opacity-75 sm:block">{stat.sub}</p>
          </div>
        ))}
      </div>
    </RevealOnScroll>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14">
      <div className="landing-hero-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="landing-fade-in mb-5 inline-flex items-center gap-2 rounded-full border border-ep-accent/30 bg-ep-accent-soft/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ep-ink/80">
          <AppIcon variant="gold" className="h-4 w-4" alt="" />
          Original-language word study
        </p>

        <h1 className="landing-fade-in landing-delay-1 text-4xl font-extrabold leading-[1.06] tracking-tight text-balance text-ep-ink sm:text-5xl lg:text-[3.35rem]">
          The future of Scripture study
          <span className="block text-ep-muted font-bold sm:inline sm:font-extrabold">
            {" "}
            is one tap on the Logos
          </span>
        </h1>

        <p className="landing-fade-in landing-delay-2 mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-pretty text-ep-muted sm:text-lg">
          Study Logos maps each verse to Greek and Hebrew — tap a word or grouped
          words to explore original language insight.
          {/* Study Logos maps each verse to Greek and Hebrew — tap a word or grouped
          words and meet the insight that stirs you to go deeper on your own. */}
        </p>

        <div className="landing-fade-in landing-delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/study" className={primaryBtnDark}>
            Open the study app
          </Link>
          <Link to="/signup" className={outlineBtn}>
            Create free account
          </Link>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-5xl px-4 sm:mt-14 sm:px-6">
        <HeroShowcase />
      </div>
    </section>
  );
}

const FEATURES = [
  {
    Icon: IconBook,
    title: "Original language",
    body: "Greek and Hebrew forms, transliteration, and context — a clear entry point for deeper study.",
    // body: "Greek and Hebrew forms, transliteration, and context — a clear entry point, not an encyclopedia dump.",
  },
  // {
  //   Icon: IconSpark,
  //   title: "Spark, don't spoon-feed",
  //   body: "We lead you to what catches your attention so you keep researching until light breaks in your heart.",
  // },
  {
    Icon: IconLayers,
    title: "Phrase-level mapping",
    body: "Words grouped by transliteration — tap one word or several when they share one original root.",
  },
  {
    Icon: IconLink,
    title: "Cross-references",
    body: "Jump to related passages and see how the same concept appears across Scripture.",
  },
  {
    Icon: IconComment,
    title: "Case studies & commentary",
    body: "Vivid illustrations and concise theological notes to help the passage come alive.",
    // body: "Vivid illustrations and concise theological notes that open a door — you walk through it.",
  },
  {
    Icon: IconNotebook,
    title: "Personal notebook",
    body: "Save every breakthrough. Sync across sessions when you sign in.",
  },
];

function FeaturesDarkGrid() {
  return (
    <section id="features" className="landing-dark-section py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className={sectionLabel + " text-white/50"}>What you get</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Integrated tools for word-level study
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-white/65">
            Original-language tools for definitions, cross-references, case studies, and more.
            {/* Enough to ignite curiosity — room for you to go further in your Bible,
            commentaries, and prayer. */}
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {FEATURES.map(({ Icon, title, body }, i) => (
            <RevealOnScroll key={title} delay={i * 60}>
              <article className="landing-dark-card h-full rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-ep-accent/30 hover:bg-white/[0.07]">
                <Icon className="h-6 w-6 text-ep-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-white/60">{body}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  // {
  //   title: "Curiosity-first design",
  //   body: "Every breakdown gives you a door — definition, first mention, narrative — not every answer.",
  // },
  {
    title: "Multiple Bible editions",
    body: "Compare NKJV, NLT, AMP and see how translators rendered the same underlying word.",
  },
  {
    title: "First mentions on demand",
    body: "Explore where a word first appears in Hebrew or Greek when you're ready to dig.",
  },
  {
    title: "Notebook that follows you",
    body: "Save words with reference, original form, and definition — synced when you sign in.",
  },
];

function BenefitsSplit() {
  return (
    <section id="approach" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll className="relative">
            <div className="landing-benefits-visual">
              <div className="landing-benefits-card landing-benefits-card-back overflow-hidden rounded-[1.25rem] border border-ep-line/80 shadow-card">
                <img
                  src={IMAGES.wordInsight}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="landing-benefits-card landing-benefits-card-front overflow-hidden rounded-[1.25rem] border border-ep-line/80 bg-ep-surface-panel shadow-card-lg">
                <img
                  src={IMAGES.studyScene}
                  alt="Open Bible pages in soft light"
                  className="aspect-[5/4] w-full object-cover"
                  loading="lazy"
                />
                <div className="border-t border-ep-line/80 bg-ep-accent-soft/50 px-4 py-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-ep-muted">
                    John 1:1 · tapped “Word”
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-ep-ink">
                    λόγος · logos · case study ready
                  </p>
                </div>
              </div>
              <div className="landing-benefits-stat rounded-[1rem] bg-ep-accent px-4 py-3 text-ep-accent-foreground shadow-soft">
                <p className="text-2xl font-extrabold">5+</p>
                <p className="text-xs font-bold">Insights per breakdown</p>
              </div>
            </div>
          </RevealOnScroll>

          <div>
            <RevealOnScroll>
              <p className={sectionLabel}>Our approach</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink sm:text-4xl">
                Key benefits of studying at the word level
              </h2>
              {/* <p className="mt-4 text-base font-medium leading-relaxed text-ep-muted">
                We won&apos;t feed you every detail. We point you to what triggers
                deeper research — until more light is expounded in your heart.
              </p> */}
            </RevealOnScroll>

            <ul className="mt-10 space-y-5">
              {BENEFITS.map((item, i) => (
                <RevealOnScroll key={item.title} delay={i * 80} as="li">
                  <div className="flex gap-4">
                    <CheckIcon />
                    <div>
                      <h3 className="font-extrabold text-ep-ink">{item.title}</h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-ep-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </ul>

            <RevealOnScroll delay={320} className="mt-10">
              <Link to="/study" className={primaryBtnDark}>
                Try a word study now
              </Link>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
const TIERS = [
  {
    name: "Explore",
    price: "Free",
    desc: "Preview the study experience before you commit.",
    features: [
      "Load any passage",
      "Limited word breakdown preview",
      "See original-language mapping",
    ],
    cta: "Open study app",
    href: "/study",
    highlighted: false,
  },
  {
    name: "Study",
    price: "Free",
    desc: "Full access during beta — notebook sync included.",
    features: [
      "Unlimited word breakdowns",
      "Case studies & cross-references",
      "Personal notebook sync",
      "First-mention exploration",
    ],
    cta: "Create account",
    href: "/signup",
    highlighted: true,
  },
];

function StudyTiers() {
  return (
    <section className="landing-tier-section py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className={sectionLabel + " text-white/45"}>Start studying</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Plans for every stage of your journey
          </h2>
          <p className="mt-4 text-base font-medium text-white/55">
            Begin as a guest, then create a free account to save your notebook and
            study without limits during beta.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {TIERS.map((tier, i) => (
            <RevealOnScroll key={tier.name} delay={i * 100}>
              <article
                className={[
                  "flex h-full flex-col rounded-[1.25rem] border p-7 sm:p-8",
                  tier.highlighted
                    ? "border-ep-accent/40 bg-[#141312] shadow-card-lg ring-1 ring-ep-accent/20"
                    : "border-white/10 bg-white/[0.04]",
                ].join(" ")}
              >
                <p className="text-sm font-bold uppercase tracking-wider text-ep-accent">
                  {tier.name}
                </p>
                <p className="mt-2 text-4xl font-extrabold text-white">{tier.price}</p>
                <p className="mt-2 text-sm font-medium text-white/55">{tier.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm font-medium text-white/75">
                      <span className="mt-0.5 text-ep-accent" aria-hidden>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.href}
                  className={
                    tier.highlighted
                      ? "mt-8 " + primaryBtnDark + " w-full"
                      : "mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  }
                >
                  {tier.cta}
                </Link>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={200} className="mt-5">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[1.25rem] border border-ep-accent/25 bg-ep-accent-soft/10 px-6 py-6 sm:flex-row sm:px-8">
            <div>
              <p className="text-lg font-extrabold text-white">Go deeper today</p>
              <p className="mt-1 text-sm font-medium text-white/55">
                From verse to Greek root in three taps — no commentaries required to start.
              </p>
            </div>
            <Link to="/study" className={primaryBtnDark + " shrink-0"}>
              Launch study app
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
*/

const EDITIONS = ["NKJV", "NLT", "AMP", "Greek", "Hebrew", "Notebook"];

function EditionsSection() {
  return (
    <section id="editions" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll>
          <p className={sectionLabel}>Bible editions</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink sm:text-4xl">
            Seamless switching between translations
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-ep-muted">
            Load a passage in NKJV, NLT, or AMP — then tap words mapped to the
            same underlying Greek or Hebrew. Your notebook keeps every edition
            alongside the original insight.
          </p>
          <Link to="/study" className={"mt-8 " + outlineBtn}>
            View all editions
          </Link>
        </RevealOnScroll>

        <RevealOnScroll delay={120} className="flex justify-center">
          <div className="landing-editions-orbit relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
            <div className="absolute inset-0 rounded-full bg-ep-accent-soft/80" aria-hidden />
            <div className="absolute inset-4 rounded-full border border-ep-accent/20" aria-hidden />
            <AppIcon variant="gold" className="relative z-10 h-16 w-16 shadow-soft" alt="" />
            {EDITIONS.map((label, i) => {
              const angle = (i / EDITIONS.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const r = 42;
              const x = 50 + r * Math.cos(rad);
              const y = 50 + r * Math.sin(rad);
              return (
                <span
                  key={label}
                  className="landing-orbit-pill absolute rounded-full border border-ep-line/80 bg-ep-surface-panel px-3 py-1.5 text-xs font-extrabold text-ep-ink shadow-card"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Choose a passage", body: "Pick book, chapter, and verse. Load your preferred edition." },
    { n: "02", title: "Tap what stirs you", body: "Words grouped by transliteration — one tap opens original language, case study, and cross-refs." },
    { n: "03", title: "Save & revisit", body: "Add breakthrough moments to your notebook and pick up tomorrow." },
  ];

  return (
    <section id="how-it-works" className="border-y border-ep-line/60 bg-ep-surface-muted/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll className="text-center">
          <p className={sectionLabel}>How it works</p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ep-ink sm:text-3xl">
            Three steps from verse to insight
          </h2>
        </RevealOnScroll>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.n} delay={i * 80}>
              <div className="rounded-[1.25rem] border border-ep-line/80 bg-ep-surface-panel p-6 shadow-card">
                <span className="text-xs font-extrabold text-ep-accent">{step.n}</span>
                <h3 className="mt-2 text-lg font-extrabold text-ep-ink">{step.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-ep-muted">{step.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotebookSection() {
  return (
    <section id="notebook" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[1.5rem] border border-ep-line/80 bg-ep-surface-panel shadow-card-lg lg:grid-cols-2">
          <RevealOnScroll className="relative min-h-[280px] lg:min-h-[400px]">
            <img
              src={IMAGES.notebook}
              alt="Notebook and pen on a desk"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-ep-ink/25" aria-hidden />
          </RevealOnScroll>

          <RevealOnScroll delay={120} className="flex flex-col justify-center p-8 sm:p-12">
            <p className={sectionLabel}>Your notebook</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink">
              A living archive of every word that moved you
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ep-muted">
              Create a free account to sync saved words across sessions — reference,
              original form, transliteration, and definition ready for sermons,
              small groups, or quiet mornings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className={primaryBtnDark}>
                Start your notebook
              </Link>
              <Link to="/study" className={ghostBtn}>
                Try without signing up
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-20 pt-4 sm:pb-28">
      <RevealOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="landing-cta-pattern relative overflow-hidden rounded-[1.5rem] px-8 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            From words to light in minutes
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base font-medium text-white/70">
            Open a verse, tap a word, and let one insight lead to the next. Beta
            access is free — start studying today.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/study" className={primaryBtnDark + " px-8 py-3.5"}>
              Launch study app
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Join the beta
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer border-t border-white/10 pt-14 pb-8 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo inverted showBeta betaLabel="Beta" betaTitle="Study Logos is currently in beta testing" />
            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-white/50">
              Scripture study at the word level — Greek and Hebrew insight for every passage.
              {/* Scripture study at the word level — Greek and Hebrew insight that
              sparks your own research. */}
            </p>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/40">Product</p>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-white/65">
              <li><Link to="/study" className="transition hover:text-ep-accent">Study app</Link></li>
              <li><a href="#features" className="transition hover:text-ep-accent">Features</a></li>
              <li><a href="#editions" className="transition hover:text-ep-accent">Editions</a></li>
              <li><a href="#notebook" className="transition hover:text-ep-accent">Notebook</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/40">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-white/65">
              <li><Link to="/signup" className="transition hover:text-ep-accent">Sign up</Link></li>
              <li><Link to="/login" className="transition hover:text-ep-accent">Sign in</Link></li>
              <li><Link to="/account" className="transition hover:text-ep-accent">Settings</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/40">Get in touch</p>
            <p className="mt-4 text-sm font-medium leading-relaxed text-white/50">
              Feedback welcome during beta — your review after five studies helps
              us improve.
            </p>
            <Link to="/study" className={"mt-4 inline-flex " + primaryBtnDark}>
              Open study app
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs font-medium text-white/40">
            © {year} Study Logos · Beta testing · All rights reserved
          </p>
          <div className="flex gap-6 text-xs font-semibold text-white/40">
            <Link to="/study" className="transition hover:text-white/70">Study</Link>
            <Link to="/login" className="transition hover:text-white/70">Sign in</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.title = "Study Logos — Original-language word study";
  }, []);

  return (
    <div className="landing-page relative min-h-screen overflow-x-hidden bg-ep-surface">
      <Nav />
      <main>
        <Hero />
        <FeaturesDarkGrid />
        <BenefitsSplit />
        {/* <StudyTiers /> */}
        <EditionsSection />
        <HowItWorks />
        <NotebookSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
