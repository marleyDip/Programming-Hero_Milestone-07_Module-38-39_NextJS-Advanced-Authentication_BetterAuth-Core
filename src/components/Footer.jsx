import Link from "next/link";

export default function Footer() {
  return (
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

        {/*  <a
            href="https://github.com/marleyDip/Programming-Hero_Milestone-07_Module-38-39_NextJS-Advanced-Authentication_BetterAuth-Core"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit my portfolio and GitHub profile"
            title="Visit my portfolio"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-400 transition-all duration-300 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-300 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:scale-110"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.467-1.11-1.467-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.646.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.95 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.701 1.027 1.595 1.027 2.688 0 3.848-2.339 4.694-4.566 4.942.359.31.678.921.678 1.856 0 1.34-.012 2.42-.012 2.75 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
              />
            </svg>
          </a> */}
      </div>
    </footer>
  );
}

/*  
<footer className="relative z-10 border-t border-white/10">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:px-8">
    <Link href="/" className="font-semibold text-slate-300">
      Next<span className="text-violet-400">Auth</span> Pro
    </Link>

    <p>Built with Next.js, HeroUI & BetterAuth.</p>

    <a
      href="https://github.com/"
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      className="transition hover:text-white"
    ></a>
  </div>
</footer> 
*/
