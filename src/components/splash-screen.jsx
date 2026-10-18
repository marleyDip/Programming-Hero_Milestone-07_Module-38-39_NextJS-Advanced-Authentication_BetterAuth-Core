"use client";

import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const SHOW_MS = 2600; // total loading time
const EXIT_MS = 700; // exit animation

const STATUSES = [
  { at: 0, text: "Initializing secure session" },
  { at: 35, text: "Verifying environment" },
  { at: 70, text: "Preparing your workspace" },
  { at: 92, text: "Almost ready" },
];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("splash-seen")) {
        setVisible(false);
        return;
      }
    } catch {}

    document.body.style.overflow = "hidden";

    let raf;
    let exitTimer;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / SHOW_MS, 1);
      setProgress(Math.round(easeOutCubic(t) * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        exitTimer = setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
          try {
            sessionStorage.setItem("splash-seen", "1");
          } catch {}
        }, EXIT_MS);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  const status = [...STATUSES].reverse().find((s) => progress >= s.at);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden bg-[#070914] text-white transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
        leaving ? "scale-110 opacity-0 blur-md" : "scale-100 opacity-100 blur-0"
      }`}
      style={{ transitionDuration: `${EXIT_MS}ms` }}
    >
      {/* Grid backdrop, fading out toward the edges */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-130 rounded-full bg-violet-600/20 blur-[140px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 size-130 rounded-full bg-indigo-600/20 blur-[140px]" />

      <div className="splash-breathe pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[90px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="relative grid size-36 place-items-center">
          {/* Outer expanding pulse */}
          <span className="splash-pulse absolute inset-2 rounded-[2.25rem] border border-violet-400/30" />

          {/* Rotating gradient ring */}
          <span
            className="splash-spin absolute inset-0 rounded-[2.5rem] p-0.5"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 55%, #8b5cf6 78%, #a5b4fc 90%, #bef264 100%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* Orbiting dot */}
          <span className="splash-spin absolute inset-0">
            <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.9)]" />
          </span>

          {/* Glass core */}
          <div className="relative grid size-24 place-items-center rounded-3xl border border-white/15 bg-linear-to-br from-violet-500 to-indigo-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_70px_rgba(139,92,246,0.5)]">
            <span className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-b from-white/25 via-transparent to-transparent" />
            <ShieldCheck size={46} className="relative drop-shadow-lg" />
          </div>
        </div>

        {/* Brand with shimmer */}
        <h1 className="mt-10 text-3xl font-bold tracking-tight">
          NextAuth{" "}
          <span className="splash-shimmer bg-linear-to-r from-violet-400 via-white to-violet-400 bg-size-[200%_100%] bg-clip-text text-transparent">
            Pro
          </span>
        </h1>

        <p className="mt-2 text-[11px] uppercase tracking-[0.35em] text-slate-500">
          Secure · Fast · Modern
        </p>

        {/* Progress */}
        <div className="mt-12 w-64">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-white/8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
            <div
              className="relative h-full rounded-full bg-linear-to-r from-violet-500 via-indigo-300 to-lime-300 shadow-[0_0_14px_rgba(139,92,246,0.7)]"
              style={{ width: `${progress}%` }}
            >
              <span className="splash-sweep absolute inset-y-0 w-10 bg-linear-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span key={status?.text} className="splash-fade text-slate-400">
              {status?.text}
            </span>

            <span className="font-mono tabular-nums text-violet-300">
              {String(progress).padStart(2, "0")}%
            </span>
          </div>
        </div>
      </div>

      {/* <style>{`
        @keyframes splash-spin { to { transform: rotate(360deg); } }
        @keyframes splash-pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes splash-breathe {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes splash-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes splash-sweep {
          0% { left: -2.5rem; }
          100% { left: 100%; }
        }
        @keyframes splash-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .splash-spin { animation: splash-spin 2.4s linear infinite; }
        .splash-pulse { animation: splash-pulse 2s ease-out infinite; }
        .splash-breathe { animation: splash-breathe 3s ease-in-out infinite; }
        .splash-shimmer { animation: splash-shimmer 3s linear infinite; }
        .splash-sweep { animation: splash-sweep 1.4s ease-in-out infinite; }
        .splash-fade { animation: splash-fade 0.4s ease-out; }

        @media (prefers-reduced-motion: reduce) {
          .splash-spin, .splash-pulse, .splash-breathe,
          .splash-shimmer, .splash-sweep { animation: none; }
        }
      `}</style> */}
    </div>
  );
}
