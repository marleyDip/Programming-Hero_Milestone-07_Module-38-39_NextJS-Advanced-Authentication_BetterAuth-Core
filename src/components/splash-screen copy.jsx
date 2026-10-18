"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_MS = 2000; // how long the splash stays fully visible
const FADE_MS = 600; // fade-out duration

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Show only once per browser session
    try {
      if (sessionStorage.getItem("splash-seen")) {
        setVisible(false);
        return;
      }
    } catch {}

    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setLeaving(true), SHOW_MS);
    const endTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem("splash-seen", "1");
      } catch {}
    }, SHOW_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-[#090b18] text-white transition-all ease-out ${
        leaving ? "scale-105 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      {/* Background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo with rings */}
        <div className="relative grid size-28 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-[2rem] border border-violet-400/30 motion-reduce:animate-none" />
          <span className="absolute inset-3 animate-pulse rounded-3xl border border-violet-400/20 motion-reduce:animate-none" />

          <div className="relative grid size-20 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-[0_0_60px_rgba(139,92,246,0.45)]">
            <ShieldCheck size={42} />
            <div className="absolute -right-2 -top-2 size-4 animate-pulse rounded-full bg-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.6)] motion-reduce:animate-none" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="mt-8 text-3xl font-bold tracking-tight">
          NextAuth <span className="text-violet-400">Pro</span>
        </h1>
        <p className="mt-2 text-xs tracking-[0.25em] text-slate-400 uppercase">
          Secure · Fast · Modern
        </p>

        {/* Progress bar */}
        <div className="mt-10 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-400 via-indigo-300 to-lime-300"
            style={{
              animation: `splash-progress ${SHOW_MS}ms ease-in-out forwards`,
            }}
          />
        </div>

        <p className="mt-4 animate-pulse text-xs text-slate-500 motion-reduce:animate-none">
          Preparing your experience...
        </p>
      </div>

      <style>{`
        @keyframes splash-progress {
          0% { width: 0%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
