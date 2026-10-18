"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 font-semibold text-slate-300 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25),6px_6px_16px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-violet-400/40 hover:text-white active:scale-[0.97] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.45),inset_-3px_-3px_8px_rgba(255,255,255,0.05)] cursor-pointer"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <ArrowLeft
        size={17}
        className="relative text-violet-300 transition-transform duration-300 group-hover:-translate-x-1"
      />
      <span className="relative tracking-wide">Go Back</span>
    </button>
  );
}
