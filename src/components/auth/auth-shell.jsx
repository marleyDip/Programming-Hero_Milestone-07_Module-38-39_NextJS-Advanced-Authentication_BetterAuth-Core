"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function AuthShell({ children }) {
  const cardRef = useRef(null);

  // Cursor spotlight: writes CSS variables, no React state involved
  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#05060a] text-white">
      {/* Aurora background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="aurora-1 absolute -left-1/4 -top-1/4 size-[60vmax] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="aurora-2 absolute -right-1/4 top-0 size-[50vmax] rounded-full bg-lime-400/15 blur-[130px]" />
        <div className="aurora-3 absolute -bottom-1/3 left-1/4 size-[50vmax] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <ShieldCheck size={22} />
          </span>
          <span className="text-base font-bold tracking-tight">
            NextAuth <span className="text-lime-300">Pro</span>
          </span>
        </Link>

        <Link
          href="/sign-in"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:border-lime-300/40 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to sign in
        </Link>
      </header>

      {/* Card */}
      <section className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-110">
          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            className="spin-border rounded-[28px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden rounded-[27px] bg-[#0a0b12]/90 p-6 backdrop-blur-2xl sm:p-9">
              <div className="spotlight pointer-events-none absolute inset-0" />
              <div className="relative">{children}</div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-slate-500">
            Protected by Better Auth. Need help?{" "}
            <Link href="/sign-in" className="text-slate-300 hover:underline">
              Return to sign in
            </Link>
            .
          </p>
        </div>
      </section>

      <style>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes spin-angle { to { --angle: 360deg; } }
        @keyframes drift-1 { 50% { transform: translate(8vmax, 6vmax) scale(1.1); } }
        @keyframes drift-2 { 50% { transform: translate(-7vmax, 8vmax) scale(1.15); } }
        @keyframes drift-3 { 50% { transform: translate(6vmax, -7vmax) scale(1.1); } }
        @keyframes rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .spin-border {
          background: conic-gradient(
            from var(--angle),
            rgba(255,255,255,0.06) 0%,
            rgba(255,255,255,0.06) 45%,
            #8b5cf6 62%,
            #22d3ee 76%,
            #bef264 90%,
            rgba(255,255,255,0.06) 100%
          );
          animation: spin-angle 7s linear infinite;
        }
        .spotlight {
          background: radial-gradient(
            420px circle at var(--mx, 50%) var(--my, 0%),
            rgba(190, 242, 100, 0.09),
            rgba(139, 92, 246, 0.07) 40%,
            transparent 70%
          );
        }
        .aurora-1 { animation: drift-1 22s ease-in-out infinite; }
        .aurora-2 { animation: drift-2 26s ease-in-out infinite; }
        .aurora-3 { animation: drift-3 30s ease-in-out infinite; }
        .rise-in { animation: rise-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .spin-border, .aurora-1, .aurora-2, .aurora-3, .rise-in { animation: none; }
        }
      `}</style>
    </main>
  );
}
