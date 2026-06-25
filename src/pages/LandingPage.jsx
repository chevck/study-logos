import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import AppIcon from "../components/AppIcon.jsx";
import RevealOnScroll from "../components/landing/RevealOnScroll.jsx";
import { ghostBtn, surfaceCard } from "../lib/uiClasses.js";

const IMAGES = {
  hero: "/landing/hero.jpg",
  wordInsight: "/landing/word-insight.jpg",
  notebook: "/landing/notebook.jpg",
  editions: "/landing/editions.jpg",
  studyScene: "/landing/study-scene.jpg",
};

const primaryBtn =
  "inline-flex items-center justify-center rounded-full bg-ep-accent px-6 py-3 text-sm font-bold tracking-tight text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover hover:scale-[1.02] active:scale-[0.98]";

function Nav() {
  return (
    <header className="ep-header-bar sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav
          aria-label="Landing navigation"
          className="mx-auto hidden items-center gap-1 md:flex"
        >
          {[
            ["#features", "Features"],
            ["#approach", "Our approach"],
            ["#how-it-works", "How it works"],
            ["#notebook", "Notebook"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ep-muted transition hover:bg-ep-surface-panel hover:text-ep-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ep-muted transition hover:text-ep-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link to="/signup" className={primaryBtn}>
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div
        className="landing-orb landing-orb-a pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-ep-glow/70 blur-3xl"
        aria-hidden
      />
      <div
        className="landing-orb landing-orb-b pointer-events-none absolute bottom-0 left-[-15%] h-[360px] w-[360px] rounded-full bg-ep-accent-soft/80 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <p className="landing-fade-in mb-4 inline-flex items-center gap-2.5 rounded-full border border-ep-accent-muted/40 bg-ep-accent-soft/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ep-ink/80">
            <AppIcon variant="gold" className="h-5 w-5" alt="" />
            Original-language word study
          </p>

          <h1
            className="landing-fade-in landing-delay-1 text-4xl font-extrabold leading-[1.08] tracking-tight text-balance text-ep-ink sm:text-5xl lg:text-[3.25rem]"
          >
            Tap a word.{" "}
            <span className="text-ep-subtle font-semibold">Or several.</span>{" "}
            <span className="relative inline-block">
              <span className="relative z-10">See the Logos</span>
              <span
                className="absolute -bottom-1 left-0 right-0 h-3 rounded-full bg-ep-accent/35 landing-underline-grow"
                aria-hidden
              />
            </span>{" "}
            behind the text.
          </h1>

          <p className="landing-fade-in landing-delay-2 mt-5 max-w-lg text-base font-medium leading-relaxed text-pretty text-ep-muted sm:text-lg">
            Study Logos maps each verse to original-language words — tap a single
            word or a group of words when they share one transliteration — and
            meets you at the moment something clicks.
          </p>

          <p className="landing-fade-in landing-delay-2 mt-4 max-w-lg border-l-2 border-ep-accent/50 pl-4 text-sm font-semibold leading-relaxed text-ep-ink/90 sm:text-base">
            We won&apos;t feed you every detail. We lead you to the point that
            stirs your interest — so you keep researching, and more light is
            expounded in your heart.
          </p>

          <div className="landing-fade-in landing-delay-3 mt-8 flex flex-wrap items-center gap-3">
            <Link to="/study" className={primaryBtn}>
              Open the study app
            </Link>
            <Link to="/signup" className={ghostBtn}>
              Create free account
            </Link>
          </div>

          <dl className="landing-fade-in landing-delay-4 mt-10 grid grid-cols-3 gap-4 border-t border-ep-line/80 pt-8">
            {[
              ["Greek & Hebrew", "Original insight"],
              ["NKJV · NLT · AMP", "Multiple editions"],
              ["Personal notebook", "Save every insight"],
            ].map(([term, desc]) => (
              <div key={term}>
                <dt className="text-sm font-extrabold text-ep-ink">{term}</dt>
                <dd className="mt-0.5 text-xs font-medium text-ep-muted">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="landing-float relative">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-ep-accent/25 via-transparent to-ep-glow/40 blur-2xl"
              aria-hidden
            />
            <div className={`relative overflow-hidden p-2 ${surfaceCard}`}>
              <img
                src={IMAGES.hero}
                alt="Warm library shelves filled with books"
                className="aspect-[4/5] w-full rounded-[1.35rem] object-cover sm:aspect-[5/6]"
                loading="eager"
                fetchPriority="high"
              />
              <div className="ep-inner-panel absolute inset-x-4 bottom-4 p-4 sm:inset-x-5 sm:bottom-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ep-muted">
                  John 1:1 · NKJV
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ep-ink">
                  Tap <span className="text-ep-accent">“was”</span> → ἦν · ēn ·
                  one word, one Greek root · case study unlocked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ image, alt, title, body, delay }) {
  return (
    <RevealOnScroll delay={delay} className={`group overflow-hidden ${surfaceCard}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ep-ink/50 via-transparent to-transparent opacity-80" />
        <h3 className="absolute bottom-4 left-4 right-4 text-xl font-extrabold tracking-tight text-white">
          {title}
        </h3>
      </div>
      <p className="p-5 text-sm font-medium leading-relaxed text-ep-muted">{body}</p>
    </RevealOnScroll>
  );
}

function PhilosophySection() {
  return (
    <section id="approach" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll
          className={`relative overflow-hidden px-8 py-10 sm:px-12 sm:py-14 ${surfaceCard}`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ep-accent/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ep-muted">
              Our approach
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-balance text-ep-ink sm:text-3xl">
              A spark for your own study — not a dump of every detail
            </h2>
            <p className="mt-5 text-base font-medium leading-relaxed text-ep-muted sm:text-lg">
              Study Logos is built to lead you to the insight that catches your
              attention: the original word, the first mention, the cross-reference
              that won&apos;t leave you alone. We don&apos;t try to answer every
              question for you.
            </p>
            <p className="mt-4 text-base font-semibold leading-relaxed text-ep-ink sm:text-lg">
              We point you to what triggers deeper research — the kind that opens
              your Bible, your commentaries, and your prayer — until more light
              is expounded in your heart.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ep-muted">
            Built to spark, not overwhelm
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink sm:text-4xl">
            Enough to ignite — room for you to go further
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-ep-muted">
            Each breakdown gives you a clear entry point — definition, first
            mention, narrative illustration — then trusts you to follow the
            thread. The goal is curiosity that keeps burning.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            delay={0}
            image={IMAGES.wordInsight}
            alt="Desk setup for focused study with notes and laptop"
            title="Original language breakdown"
            body="Greek and Hebrew forms, transliteration, and definitions for the word you tapped — a clear entry point that sparks deeper research, not a lesson that ends when you close the panel."
          />
          <FeatureCard
            delay={120}
            image={IMAGES.editions}
            alt="Stack of books on a shelf"
            title="Multiple Bible editions"
            body="Switch between NKJV, NLT, AMP and more. Compare how translators rendered the same underlying word across traditions."
          />
          <FeatureCard
            delay={240}
            image={IMAGES.notebook}
            alt="Hand writing in a journal"
            title="Your study notebook"
            body="Save words, references, and definitions to a personal notebook that syncs when you sign in — build a library of insights over time."
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Choose a passage",
      body: "Pick book, chapter, and verse — or search by reference. Load the text in your preferred Bible edition.",
    },
    {
      n: "02",
      title: "Follow what stirs you",
      body: "Each tap opens a door — original language, first mention, case study — not an encyclopedia. Take what sparks you and go deeper on your own.",
    },
    {
      n: "03",
      title: "Save & revisit",
      body: "Add breakthrough moments to your notebook. Return tomorrow and pick up exactly where your study left off.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <RevealOnScroll>
            <div className={`overflow-hidden ${surfaceCard}`}>
              <img
                src={IMAGES.studyScene}
                alt="Open book pages in soft natural light"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          </RevealOnScroll>

          <div>
            <RevealOnScroll>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ep-muted">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink sm:text-4xl">
                Three steps from verse to insight
              </h2>
            </RevealOnScroll>

            <ol className="mt-10 space-y-6">
              {steps.map((step, i) => (
                <RevealOnScroll key={step.n} delay={i * 100} as="li">
                  <div className="flex gap-5 rounded-2xl border border-ep-line/80 bg-ep-surface-panel/70 p-5 transition hover:border-ep-accent-muted/50 hover:bg-ep-surface-panel hover:shadow-card">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ep-accent-soft text-xs font-extrabold text-ep-ink">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-ep-ink">{step.title}</h3>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-ep-muted">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotebookSection() {
  return (
    <section id="notebook" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`grid overflow-hidden lg:grid-cols-2 ${surfaceCard}`}>
          <RevealOnScroll className="relative min-h-[280px] lg:min-h-[420px]">
            <img
              src={IMAGES.notebook}
              alt="Notebook and pen on a desk"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-ep-ink/20" aria-hidden />
          </RevealOnScroll>

          <RevealOnScroll delay={150} className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ep-muted">
              Your notebook
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ep-ink">
              A living archive of every word that moved you
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-ep-muted">
              Create a free account to sync your saved words across sessions.
              Each entry keeps the reference, original form, transliteration,
              and definition — ready for sermons, small groups, or quiet mornings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className={primaryBtn}>
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

function QuoteBand() {
  return (
    <section className="py-16 sm:py-20">
      <RevealOnScroll className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <blockquote className="text-2xl font-extrabold leading-snug tracking-tight text-ep-ink sm:text-3xl">
          “In the beginning was the Word, and the Word was with God, and the Word
          was God.”
        </blockquote>
        <cite className="mt-4 block text-sm font-semibold not-italic text-ep-muted">
          John 1:1 · NKJV
        </cite>
      </RevealOnScroll>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="pb-20 pt-4 sm:pb-28">
      <RevealOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-ep-ink px-8 py-14 text-center sm:px-12 sm:py-16">
          <div
            className="landing-orb landing-orb-a pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ep-accent/30 blur-3xl"
            aria-hidden
          />
          <div
            className="landing-orb landing-orb-b pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-ep-glow/20 blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to study deeper?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base font-medium text-white/75">
            Open a passage, tap a word, and let one insight lead to the next.
            We won&apos;t feed you every detail — we&apos;ll lead you to the
            point that makes you want more, until light breaks in your heart.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/study"
              className="inline-flex items-center justify-center rounded-full bg-ep-accent px-7 py-3.5 text-sm font-bold text-ep-accent-foreground shadow-soft transition hover:bg-ep-accent-hover hover:scale-[1.02]"
            >
              Launch study app
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Sign in
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ep-line/80 bg-ep-surface-muted/50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <Logo />
        <p className="text-sm font-medium text-ep-muted">
          © {new Date().getFullYear()} Study Logos · Beta testing · Scripture study at the word level
        </p>
        <div className="flex gap-4 text-sm font-semibold text-ep-muted">
          <Link to="/study" className="transition hover:text-ep-ink">
            Study
          </Link>
          <Link to="/login" className="transition hover:text-ep-ink">
            Sign in
          </Link>
          <Link to="/signup" className="transition hover:text-ep-ink">
            Sign up
          </Link>
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
    <div className="landing-page relative min-h-screen overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <PhilosophySection />
        <Features />
        <HowItWorks />
        <NotebookSection />
        <QuoteBand />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
