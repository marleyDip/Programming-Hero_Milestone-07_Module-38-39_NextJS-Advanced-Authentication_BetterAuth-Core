"use client";

import { authClient } from "@/lib/auth-client";

// import { Spinner } from "@heroui/react";
import {
  BadgeCheck,
  ChevronDown,
  LoaderCircle,
  LogOut,
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

function Avatar({ user, size = "size-9" }) {
  return (
    <span
      className={`${size} relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white`}
    >
      {user.image ? (
        // Plain <img> avoids configuring next/image remote domains for Google/GitHub avatars
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

export default function UserMenu() {
  const router = useRouter();

  // It is a React Hook that establishes a reactive, stateful connection to the user's login status.
  const { data: session, isPending, error } = authClient.useSession();

  // console.log("The session loads on the client", session);

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);

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

  // Sign Out Function
  const handleSignOut = async () => {
    setSigningOut(true);

    const toastId = toast.loading("Signing you out...");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Sign out failed", {
          id: toastId,
          description: error.message || "Please try again.",
        });
        return;
      }

      toast.success("Signed out", {
        id: toastId,
        description: "See you again soon!",
      });

      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setSigningOut(false);
    }
  };

  // Loading: skeleton, same footprint as the buttons, so the navbar doesn't jump
  if (isPending) {
    return (
      <div
        aria-hidden="true"
        className="h-10.5 w-36 animate-pulse rounded-xl bg-white/5 sm:w-48"
      />
    );
  }

  /* if (isPending) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Spinner size="xl" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    );
  } */

  // Handle optional error states
  if (error) {
    return <div>Authentication error occurred.</div>;
  }

  // Signed out: original buttons
  if (!session?.user) {
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

  // Signed in: profile dropdown
  const { user } = session;

  /* const authLinks = (
    <>
      {session?.user ? (
        <>
          <span>Welcome, {session.user?.name}</span>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </>
      )}
    </>
  ); */

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`group flex cursor-pointer items-center gap-2.5 rounded-full border bg-white/5 py-1 pl-1 pr-3 backdrop-blur-xl transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b19] ${
          open
            ? "border-violet-400/50 bg-violet-500/10 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
            : "border-white/10"
        }`}
      >
        {/* Gradient ring & online dot */}
        <span className="relative rounded-full bg-linear-to-br from-violet-400 via-indigo-300 to-lime-300 p-0.5">
          <Avatar user={user} />

          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#080b19] bg-lime-300" />
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

      {/* Dropdown panel (kept mounted so it can animate in and out) */}
      <div
        role="menu"
        aria-label="Account menu"
        className={`absolute right-0 top-full z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#0d1024]/95 shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-200 ease-out ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
        }`}
      >
        {/* Top highlight line */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-violet-300/70 to-transparent" />

        {/* User header */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-linear-to-br from-violet-500/10 to-transparent p-4">
          <span className="rounded-full bg-linear-to-br from-violet-400 via-indigo-300 to-lime-300 p-0.5">
            <Avatar user={user} size="size-12" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span className="truncate">{user.name}</span>
              {user.emailVerified && (
                <BadgeCheck
                  size={15}
                  className="shrink-0 text-lime-300"
                  aria-label="Verified email"
                />
              )}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="p-2">
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-violet-500/10 hover:text-white focus-visible:bg-violet-500/10 focus-visible:outline-none"
          >
            <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/4 text-violet-300 transition group-hover:border-violet-400/40 group-hover:bg-violet-500/15">
              <UserRound size={17} />
            </span>

            <span className="flex-1 font-medium">Profile</span>
          </Link>

          <div className="my-1.5 h-px bg-white/10" />

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-red-500/10 hover:text-red-200 focus-visible:bg-red-500/10 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/4 text-red-300 transition group-hover:border-red-400/40 group-hover:bg-red-500/15">
              {signingOut ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <LogOut size={17} />
              )}
            </span>

            <span className="flex-1 font-medium">
              {signingOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* Unlike authClient.getSession(), which you have to manually await inside an asynchronous function, useSession() works directly within the body of your functional components:

  • React State Management: It automatically manages loading states and updates your UI the moment a user logs in or logs out.

  • Smart Caching: It prevents unnecessary network requests by caching the session data and sharing it across components.

  • Component-Level Execution: It must follow the rules of React Hooks (cannot be called inside loops, conditions, or regular JavaScript functions).

  - useSession() idiomatic way to handle authentication inside React client components ("use client").


  const { data: session } = await authClient.getSession();

  • How it works: This utilizes the authClient instance initialized for the browser. When executed, it makes an asynchronous HTTP network request behind the scenes to fetch the session data.
  
  • Why no headers? Because this code runs in the browser, the browser naturally forwards all relevant httpOnly cookies along with the network request automatically.
  
  • Best used in: Event handlers inside client components (e.g., inside a button click function) where you don't want to use a reactive hook.

Note: 
  If you are looking for real-time reactivity in UI components on the client side, you should generally prefer Better Auth's reactive useSession() hook instead of manually awaiting authClient.getSession().

Summary of Choices:

  • Use auth.api.getSession() on the Server (Server Components, Actions, Routes).
  
  • Use authClient.getSession() in Client Event Handlers (e.g., checking session right inside a submit function without re-rendering the component).
  
  • Use authClient.useSession() in Client UI rendering (to show/hide elements dynamically based on user state).

*/
