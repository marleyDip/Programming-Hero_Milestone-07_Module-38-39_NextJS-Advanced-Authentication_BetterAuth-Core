import {
  ArrowRight,
  Code2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description:
      "Protect user accounts with secure sessions, authentication flows, and protected routes.",
  },

  {
    icon: Zap,
    title: "Fast & Reliable",
    description:
      "Build a modern authentication experience with Next.js and BetterAuth.",
  },

  {
    icon: Users,
    title: "Social Login",
    description:
      "Let users authenticate with Google, GitHub, or email and password.",
  },

  {
    icon: Code2,
    title: "Developer Friendly",
    description:
      "Enjoy a clean setup, reusable components, and a flexible authentication architecture.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b19] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-48 -top-40 size-125 rounded-full bg-violet-600/20 blur-[150px]" />

      <div className="pointer-events-none absolute right-0 top-72 size-100 rounded-full bg-indigo-600/15 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 size-80 rounded-full bg-lime-400/10 blur-[130px]" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-5 sm:px-5 sm:gap-4 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <ShieldCheck size={25} />
            </div>

            <div>
              <span className="text-xl font-bold tracking-tight">
                Next<span className="text-violet-400">Auth</span>
              </span>

              <span className="hidden sm:inline-block ml-2 rounded-full border border-violet-400/30 px-2 py-0.5 text-xs text-violet-300">
                Pro
              </span>
            </div>
          </Link>

          {/* Nav href */}
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-violet-300">
              Home
            </a>

            <a href="#features" className="transition hover:text-violet-300">
              Features
            </a>

            <a
              href="https://www.better-auth.com/docs"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-violet-300"
            >
              Docs
            </a>

            <a href="#about" className="transition hover:text-violet-300">
              About
            </a>
          </div>

          {/* Authentication Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="rounded-xl border border-violet-400/40 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-500/10 sm:px-6"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl bg-linear-to-r from-violet-600 via-indigo-500 to-lime-300 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.03] hover:brightness-110 sm:px-6"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-16"
      >
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            <Sparkles size={16} />
            Secure <span className="text-violet-400">•</span>
            Fast <span className="text-violet-400">•</span>
            Modern
          </div>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
            NextJS BetterAuth -
            <span className="mt-2 block bg-linear-to-r from-violet-400 via-indigo-300 to-lime-300 bg-clip-text text-transparent">
              Authentication Advanced
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-8 text-slate-300 text-justify sm:text-base md:text-lg sm:text-left">
            A modern authentication solution for Next.js applications, powered
            by BetterAuth. Enjoy seamless Google and GitHub OAuth, email and
            password authentication, email verification, password recovery, and
            secure profile management—all in one flexible, reliable, and
            user-friendly authentication experience.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-violet-600 via-indigo-500 to-lime-300 px-7 py-3.5 font-semibold shadow-xl shadow-violet-600/20 transition hover:-translate-y-1 hover:brightness-110"
            >
              Get Started
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-xl border border-violet-400/40 px-7 py-3.5 font-semibold transition hover:border-violet-300 hover:bg-violet-500/10"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-lime-300" />
              Secure sessions
            </span>

            <span className="flex items-center gap-2">
              <LockKeyhole size={16} className="text-violet-300" />
              Protected routes
            </span>
          </div>
        </div>

        {/* Visual authentication preview */}
        <div className="relative mx-auto flex min-h-90 w-full max-w-lg items-center justify-center sm:min-h-107.5">
          <div className="absolute inset-8 rounded-full bg-violet-600/20 blur-[80px]" />

          <div className="absolute h-64 w-64 rounded-full border border-violet-400/20 sm:h-80 sm:w-80" />
          <div className="absolute h-52 w-52 rounded-full border border-indigo-400/20 sm:h-64 sm:w-64" />

          <div className="absolute left-2 top-12 rounded-xl border border-violet-400/30 bg-[#11152b]/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-0">
            <span className="flex items-center gap-2 text-sm text-violet-200">
              <LockKeyhole size={18} />
              BetterAuth
            </span>
          </div>

          <div className="relative z-10 w-[85%] -rotate-3 rounded-3xl border border-indigo-300/30 bg-[#10152b]/90 p-5 shadow-[0_25px_100px_rgba(99,55,230,0.2)] backdrop-blur-2xl transition duration-500 hover:rotate-0 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold">Welcome Back</p>
                <p className="mt-1 text-sm text-slate-400">
                  Your security starts here.
                </p>
              </div>

              <div className="grid size-12 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                <ShieldCheck size={28} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3.5">
                <Users size={19} className="text-slate-400" />
                <span className="text-sm text-slate-400">
                  Secure user accounts
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/4 px-4 py-3.5">
                <LockKeyhole size={19} className="text-slate-400" />
                <span className="text-sm text-slate-400">
                  Encrypted communication
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-500 py-3.5 font-semibold shadow-lg shadow-violet-600/20">
                <ShieldCheck size={19} />
                Authentication secured
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-lime-300" />
                Email
              </span>

              <span>•</span>
              <span>Google</span>
              <span>•</span>
              <span>GitHub</span>
            </div>
          </div>

          <div className="absolute bottom-8 right-0 rounded-xl border border-lime-300/20 bg-[#11152b]/90 px-4 py-3 text-sm text-slate-200 shadow-xl backdrop-blur-xl sm:bottom-10">
            <span className="mr-2 text-lime-300">✓</span>
            Your data, your control
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 md:pb-28"
      >
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
            Why NextAuth Pro?
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for authentication
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            A clean foundation for building reliable sign-up, sign-in, and
            session management experiences.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl border border-white/10 bg-white/2.5 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/6"
            >
              <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
                <Icon size={26} />
              </div>

              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section
        id="about"
        className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8"
      >
        <div className="flex flex-col items-start justify-between gap-7 rounded-3xl border border-violet-400/20 bg-linear-to-br from-violet-500/10 via-white/2.5 to-lime-300/4 p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to get started?
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-slate-400">
              Create your account and explore a modern authentication experience
              powered by BetterAuth.
            </p>
          </div>

          <Link
            href="/sign-up"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-500 px-6 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-8">
          <Link
            href="/"
            className="font-semibold text-slate-300 transition-colors hover:text-white"
          >
            Next<span className="text-violet-400">Auth</span> Pro
          </Link>

          <p>Built with ❤️ using Next.js, HeroUI &amp; BetterAuth.</p>

          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/marleyDip/Programming-Hero_Milestone-07_Module-38-39_NextJS-Advanced-Authentication_BetterAuth-Core"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
              className="group flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-slate-400/50 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:shadow-white/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.467-1.11-1.467-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.646.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.95 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.701 1.027 1.595 1.027 2.688 0 3.848-2.339 4.694-4.566 4.942.359.31.678.921.678 1.856 0 1.34-.012 2.42-.012 2.75 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
                />
              </svg>
            </a>

            {/* Portfolio */}
            <a
              href="https://marleydip.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit portfolio"
              title="Portfolio"
              className="group flex size-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-400 transition-all duration-300 hover:translate-y-1 hover:rotate-3 hover:border-fuchsia-400/50 hover:bg-linear-to-br hover:from-violet-500 hover:to-fuchsia-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/25"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              >
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M3 9h18" />
                <circle cx="6.5" cy="6.5" r=".5" fill="currentColor" />
                <circle cx="9" cy="6.5" r=".5" fill="currentColor" />
                <path d="m10 13-2 2 2 2" />
                <path d="m14 13 2 2-2 2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
  A modern authentication solution for your Next.js applications.
  Experience secure, flexible, and seamless authentication with
  BetterAuth, supporting email and password as well as Google and
  GitHub social login.
</p> */
