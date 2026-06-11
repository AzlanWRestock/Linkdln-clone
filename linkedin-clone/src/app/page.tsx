"use client";

import Link from "next/link";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Network", href: "#network" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    title: "Smart Profiles",
    description:
      "Advanced 4-step onboarding tracks custom business roles, industry sectors, or university backgrounds — so your professional identity is precise from day one.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "Real-time Messaging",
    description:
      "Fully encrypted, database-backed live direct chat with your network connections. Messages sync instantly so conversations never miss a beat.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Integrated Restock AI",
    description:
      "A built-in context-aware assistant supplying instant operational answers, platform guidance, and curated market trends — right inside your workflow.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-black transition-opacity duration-300 hover:opacity-80 sm:text-2xl"
          >
            Restock
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <button
                key={label}
                type="button"
                onClick={() => scrollToSection(href)}
                className="text-sm font-medium text-gray-600 transition-all duration-300 hover:text-gray-900"
              >
                {label}
              </button>
            ))}
          </nav>

          <Link
            href="/feed"
            className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-sky-100/60 blur-3xl transition-all duration-700" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl transition-all duration-700" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 transition-all duration-300">
            Supply Chain · Commerce · Connection
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            The Professional Network Built for{" "}
            <span className="bg-gradient-to-r from-sky-700 to-indigo-600 bg-clip-text text-transparent">
              Supply Chain &amp; Commerce
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Restock links industries, hosts a smart local AI assistant, and enables
            real-time messaging — giving operations leaders, procurement teams,
            and commerce professionals one place to connect, collaborate, and grow.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/feed"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-10 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-sky-700 hover:shadow-xl"
            >
              Get Started
            </Link>
            <button
              type="button"
              onClick={() => scrollToSection("#features")}
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-10 py-4 text-base font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md"
            >
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to lead
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Purpose-built tools for the modern supply chain professional — from
              onboarding to AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-gray-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-sky-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Network highlight */}
      <section
        id="network"
        className="scroll-mt-20 border-y border-gray-200 bg-[#f3f2ef] px-6 py-24"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your network, amplified
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Discover peers across construction, IT, procurement, game development,
              hardware engineering, and more. Connect with managers, founders, and
              students who share your sector — then message them in real time.
            </p>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-4">
            {["Supply Chain", "Procurement", "Operations", "Commerce"].map(
              (tag) => (
                <div
                  key={tag}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-4 text-center text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {tag}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About Restock
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Restock is a single-player professional platform designed to mirror the
            clean, focused experience of modern business networks — with a light-mode
            interface, live messaging, smart profiles, and an integrated AI assistant
            built for supply chain and commerce leaders who move fast.
          </p>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-[#f3f2ef] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to optimize your professional network?
          </h2>
          <p className="mt-4 text-gray-600">
            Join Restock today and start connecting with the people who power global
            commerce.
          </p>
          <Link
            href="/feed"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-sky-600 px-12 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-sky-700 hover:shadow-xl"
          >
            Join Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-lg font-bold text-black">Restock</span>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Restock. Professional networking for
            supply chain leaders.
          </p>
        </div>
      </footer>
    </div>
  );
}
