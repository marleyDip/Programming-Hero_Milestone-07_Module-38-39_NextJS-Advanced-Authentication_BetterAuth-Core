"use client";

import { authClient } from "@/lib/auth-client";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const formatMemberSince = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

function Avatar({ user, size = "size-9", text = "text-xs" }) {
  return (
    <span
      className={`${size} ${text} relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-violet-500 to-indigo-600 font-bold text-white`}
    >
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      ) : (
        getInitials(user.name)
      )}
    </span>
  );
}

export default function UserMenu({ user }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const getItems = () =>
    Array.from(panelRef.current?.querySelectorAll('[role="menuitem"]') ?? []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Arrow-key navigation inside the menu
  const handlePanelKeyDown = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();

    const items = getItems();
    const index = items.indexOf(document.activeElement);

    const next =
      e.key === "ArrowDown"
        ? items[(index + 1) % items.length]
        : items[(index - 1 + items.length) % items.length];
    next?.focus();
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setOpen(true);
      setTimeout(() => getItems()[0]?.focus(), 60);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    const toastId = toast.loading("Signing you out...");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          "Sign out failed",

          {
            id: toastId,
            description: error.message || "Please try again.",
          },
        );

        return;
      }

      toast.success(
        "Signed out",

        {
          id: toastId,
          description: "See you again soon!",
        },
      );

      setOpen(false);
      router.push("/");
      router.refresh(); // the server re-reads the session and user becomes null
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setSigningOut(false);
    }
  };

  /* Signed out */
  if (!user) {
    return (
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
    );
  }

  const memberSince = formatMemberSince(user.createdAt);

  /* Signed in */
  return (
    <div ref={wrapperRef} className="relative">
      {/* ================= Trigger ================= */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`group flex cursor-pointer items-center gap-2.5 rounded-full border bg-white/5 py-1 pl-1 pr-3 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b19] ${
          open
            ? "border-violet-400/50 bg-violet-500/10 shadow-[0_0_28px_rgba(139,92,246,0.3)]"
            : "border-white/10"
        }`}
      >
        {/* Rotating gradient ring & presence dot */}
        <span className="um-ring relative rounded-full p-0.5">
          <span className="block rounded-full bg-[#080b19] p-px">
            <Avatar user={user} />
          </span>

          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#080b19] bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.7)]" />
        </span>

        <span className="hidden max-w-28 truncate text-sm font-medium text-slate-100 sm:block">
          {user.name?.split(" ")[0] || "Account"}
        </span>

        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 group-hover:text-white ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================= Dropdown ================= */}
      <div
        ref={panelRef}
        role="menu"
        aria-label="Account menu"
        onKeyDown={handlePanelKeyDown}
        className={`um-border absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] origin-top-right rounded-3xl p-px shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_60px_rgba(124,58,237,0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-[23px] bg-[#0b0e22]/95 backdrop-blur-2xl">
          {/* ---- Cover ---- */}
          <div className="relative h-24 overflow-hidden bg-linear-to-br from-violet-600/50 via-indigo-600/30 to-cyan-500/20">
            <div className="absolute -left-6 -top-10 size-36 rounded-full bg-violet-500/50 blur-3xl" />

            <div className="absolute -right-6 top-0 size-32 rounded-full bg-lime-300/25 blur-3xl" />

            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                maskImage: "linear-gradient(to bottom, black, transparent 90%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 90%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-[#0b0e22] to-transparent" />

            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-lime-200 backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-lime-300" />
              Signed in
            </span>
          </div>

          {/* ---- Identity ---- */}
          <div className="relative -mt-10 px-5 pb-4">
            <span className="um-ring inline-block rounded-full p-0.75 shadow-[0_8px_30px_rgba(124,58,237,0.35)]">
              <span className="block rounded-full bg-[#0b0e22] p-0.5">
                <Avatar user={user} size="size-16" text="text-lg" />
              </span>
            </span>

            <div className="mt-3 flex items-center gap-1.5">
              <p className="truncate text-lg font-bold tracking-tight text-white">
                {user.name}
              </p>

              {user.emailVerified && (
                <BadgeCheck
                  size={18}
                  className="shrink-0 text-lime-300"
                  aria-label="Verified email"
                />
              )}
            </div>

            <p className="mt-0.5 truncate text-sm text-slate-400">
              {user.email}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
                <ShieldCheck size={12} />
                {user.emailVerified ? "Verified" : "Unverified"}
              </span>

              {memberSince && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                  <CalendarDays size={12} />
                  Since {memberSince}
                </span>
              )}
            </div>
          </div>

          <div className="mx-5 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

          {/* ---- Actions ---- */}
          <div className="space-y-1 p-2.5">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="um-item group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 transition-all duration-200 hover:bg-violet-500/10 focus-visible:bg-violet-500/10 focus-visible:outline-none"
              style={{ "--i": 0 }}
            >
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-violet-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="grid size-10 place-items-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition-all duration-300 group-hover:scale-105 group-hover:border-violet-400/50 group-hover:bg-violet-500/20 group-hover:text-violet-200">
                <UserRound size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-100">
                  Profile
                </span>

                <span className="block text-xs text-slate-500">
                  View and edit your account
                </span>
              </span>

              <ArrowUpRight
                size={16}
                className="text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
              />
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              className="um-item group relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-red-500/10 focus-visible:bg-red-500/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              style={{ "--i": 1 }}
            >
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-red-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="grid size-10 place-items-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300 transition-all duration-300 group-hover:scale-105 group-hover:border-red-400/50 group-hover:bg-red-500/20 group-hover:text-red-200">
                {signingOut ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-100 transition-colors group-hover:text-red-100">
                  {signingOut ? "Signing out..." : "Sign out"}
                </span>

                <span className="block text-xs text-slate-500">
                  End your session securely
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* <style>{`
        @property --um-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes um-spin { to { --um-angle: 360deg; } }
        @keyframes um-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .um-ring {
          background: conic-gradient(from var(--um-angle), #8b5cf6, #22d3ee, #bef264, #8b5cf6);
          animation: um-spin 6s linear infinite;
        }

        .um-border {
          background: conic-gradient(
            from var(--um-angle),
            rgba(255,255,255,0.08) 0%,
            rgba(255,255,255,0.08) 50%,
            #8b5cf6 68%,
            #22d3ee 82%,
            #bef264 94%,
            rgba(255,255,255,0.08) 100%
          );
          animation: um-spin 8s linear infinite;
        }

        [aria-expanded="true"] + .um-border .um-item {
          animation: um-item-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: calc(var(--i) * 70ms + 120ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .um-ring, .um-border { animation: none; }
          [aria-expanded="true"] + .um-border .um-item { animation: none; }
        }
      `}</style> */}
    </div>
  );
}
