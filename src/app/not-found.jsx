import BackButton from "@/components/back-button";
import { Compass, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "404 - Page not found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b18] px-5 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <ShieldCheck size={25} />
          </div>
          <p className="text-lg font-bold tracking-tight">
            NextAuth <span className="text-violet-400">Pro</span>
          </p>
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/4.5 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-10">
          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
            <Compass size={32} className="animate-pulse" />
          </div>

          <p className="bg-linear-to-r from-violet-400 via-indigo-300 to-lime-300 bg-clip-text text-8xl font-bold leading-none tracking-tight text-transparent sm:text-9xl">
            404
          </p>

          <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
            The page you are looking for doesn&apos;t exist, was moved, or you
            don&apos;t have access to it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-violet-400/25 bg-[#171323] px-5 py-3.5 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-violet-400/60 hover:bg-[#211a35] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_25px_rgba(139,92,246,0.18)] active:scale-[0.99]"
            >
              <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-violet-500/8 via-fuchsia-400/4 to-indigo-500/8 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <Home size={17} className="relative text-violet-300" />
              <span className="relative tracking-wide">Back to Home</span>
            </Link>

            <BackButton />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Error code: 404 · NextAuth Pro
        </p>
      </div>
    </main>
  );
}
