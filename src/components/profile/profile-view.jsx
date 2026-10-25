"use client";

// import { authClient } from "@/lib/auth-client";
import {
  changeEmail,
  changePassword,
  sendVerificationEmail,
  updateUser,
} from "@/lib/auth-client";
import UserMenu from "./user-menu-client";

import {
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MailWarning,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { emailTakenByAnotherUser } from "@/app/actions/check-email";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/4 pl-11 text-white placeholder:text-slate-500 transition focus-within:border-lime-300/60 focus-within:bg-white/6 focus-within:ring-4 focus-within:ring-lime-300/10";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const RESEND_COOLDOWN = 60;

const providerNames = {
  credential: "Email & password",
  google: "Google",
  github: "GitHub",
};

const tabs = [
  {
    id: "account",
    label: "Account",
    hint: "Your display name",
    icon: UserRound,
  },

  { id: "email", label: "Email", hint: "Where we reach you", icon: Mail },

  {
    id: "security",
    label: "Security",
    hint: "Password & sessions",
    icon: ShieldCheck,
  },
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

const getStrength = (v) =>
  [
    v.length >= 8,
    /[A-Z]/.test(v),
    /[a-z]/.test(v),
    /[0-9]/.test(v),
    /[^A-Za-z0-9]/.test(v),
  ].filter(Boolean).length;

/* ---------- small building blocks ---------- */
function Avatar({ user, size = "size-24", text = "text-3xl" }) {
  return (
    <span
      className={`${size} ${text} grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br from-violet-500 to-indigo-600 font-bold text-white`}
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

function IconField({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  autoComplete,
  trailing,
  hint,
  children,
  ...fieldProps
}) {
  return (
    <TextField className="w-full" isRequired {...fieldProps}>
      <Label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </Label>

      <div className="relative w-full">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
        />

        <Input
          fullWidth
          className={`${inputClass} ${trailing ? "pr-12" : ""}`}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />

        {trailing}
      </div>

      {hint && (
        <Description className="mt-2 text-xs text-slate-500">
          {hint}
        </Description>
      )}

      <FieldError />

      {children}
    </TextField>
  );
}

function RevealButton({ shown, onToggle }) {
  return (
    <button
      type="button"
      aria-label={shown ? "Hide password" : "Show password"}
      onClick={onToggle}
      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition hover:text-white"
    >
      {shown ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

function SubmitButton({
  loading,
  disabled,
  loadingText,
  icon: Icon = Save,
  children,
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 px-7 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_30px_rgba(190,242,100,0.25)]"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full group-disabled:hidden" />
      <span className="relative flex items-center gap-2">
        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />

            {loadingText}
          </>
        ) : (
          <>
            <Icon size={18} />

            {children}
          </>
        )}
      </span>
    </button>
  );
}

function Panel({ icon: Icon, title, description, children }) {
  return (
    <div className="pf-in relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0b12]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-lime-300/60 to-transparent" />

      <div className="mb-7 flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-lime-300/20 to-violet-500/20 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <Icon size={22} />
        </span>

        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-xs text-slate-400 md:text-sm">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function CompletenessRing({ value }) {
  const r = 34;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative grid size-20 shrink-0 place-items-center">
      <svg
        viewBox="0 0 80 80"
        className="size-20 -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pf-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#bef264" />
          </linearGradient>
        </defs>

        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          strokeWidth="6"
          className="stroke-white/10"
        />

        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke="url(#pf-grad)"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="transition-all duration-700"
        />
      </svg>

      <span className="absolute text-sm font-bold tabular-nums">{value}%</span>
    </div>
  );
}

/* ---------- main component ---------- */
export default function ProfileView({ user, hasPassword, providers }) {
  const router = useRouter();

  const [cooldown, setCooldown] = useState(0);
  const [tab, setTab] = useState("account");
  const [busy, setBusy] = useState(""); // "name" | "email" | "password"

  // Name & email: controlled only so "Save" can enable when something changed
  const [name, setName] = useState(user.name ?? "");
  const [newEmail, setNewEmail] = useState("");

  // Password: only the new password needs state (strength meter + confirm check)
  const [newPassword, setNewPassword] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

  const strength = getStrength(newPassword);
  const strengthLabel =
    strength <= 2 ? "Weak" : strength <= 3 ? "Medium" : "Strong";

  const strengthColor =
    strength <= 2
      ? "bg-rose-400"
      : strength <= 3
        ? "bg-amber-400"
        : "bg-lime-300";

  const nameDirty =
    name.trim() !== (user.name ?? "") && name.trim().length >= 3;

  const emailReady =
    emailRegex.test(newEmail) &&
    newEmail.trim().toLowerCase() !== user.email.toLowerCase();

  const socialConnected = providers.some((p) => p !== "credential");
  const checks = [
    { label: "Name added", done: Boolean(user.name?.trim()) },
    { label: "Email verified", done: user.emailVerified },
    { label: "Password set", done: hasPassword },
    { label: "Social account linked", done: socialConnected },
  ];

  const completeness = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100,
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Shared request runner: loading toast -> success/error toast
  const run = async ({
    key,
    loading,
    errorTitle,
    action,
    success,
    logLabel,
  }) => {
    setBusy(key);
    const id = toast.loading(loading);

    try {
      const { data, error } = await action();

      // console.log(`${logLabel}:`, data);

      if (error) {
        toast.error(errorTitle, {
          id,
          description: error.message || "Please try again.",
        });
        return false;
      }

      toast.success(success.title, { id, description: success.description });

      return true;
    } catch {
      // console.error(`${logLabel} error:`, error);

      toast.error("Something went wrong", {
        id,
        description: "Please try again in a moment.",
      });

      return false;
    } finally {
      setBusy("");
    }
  };

  const handleResend = async () => {
    const ok = await run({
      key: "resend",
      loading: "Sending verification email...",
      errorTitle: "Couldn't send the email",
      action: () =>
        sendVerificationEmail({
          email: user.email,
          callbackURL: "/profile",
        }),

      success: {
        title: "Verification email sent",
        description: `Check ${user.email}, including your spam folder.`,
      },
    });

    if (ok) setCooldown(RESEND_COOLDOWN);
  };

  // Handle Name Function
  const handleName = async (e) => {
    e.preventDefault();

    const ok = await run({
      key: "name",
      loading: "Saving your name...",
      errorTitle: "Update failed",
      logLabel: "Name update",

      // action: () => authClient.updateUser({ name: name.trim() }),
      action: () => updateUser({ name: name.trim() }),
      success: {
        title: "Profile updated",
        description: "Your name has been saved.",
      },
    });

    if (ok) router.refresh();
  };

  // Handle Email Function
  const handleEmail = async (e) => {
    e.preventDefault();

    const requested = newEmail.trim().toLowerCase();

    /* if (await emailTakenByAnotherUser(requested)) {
      toast.error("Email already in use", {
        description:
          "Another account already uses this email address. Try a different one.",
      });
      return;
    } */

    // Block the request early if another account already uses this email
    setBusy("email");
    try {
      if (await emailTakenByAnotherUser(requested)) {
        toast.error("Email already in use", {
          description:
            "Another account already uses this email address. Try a different one.",
        });
        return;
      }
    } catch {
      toast.error("Couldn't check that email", {
        description: "Please try again in a moment.",
      });
      return;
    } finally {
      setBusy("");
    }

    const ok = await run({
      key: "email",
      loading: "Updating your email...",
      errorTitle: "Email change failed",
      logLabel: "Email update",

      action: () =>
        // authClient.changeEmail({
        changeEmail({
          // newEmail: newEmail.trim().toLowerCase(),
          newEmail: requested,
          callbackURL: "/profile",
        }),

      success: {
        title: user.emailVerified
          ? "Check your current inbox"
          : "Email updated",
        description: user.emailVerified
          ? `We sent an approval link to ${user.email}. After you approve it, we'll verify ${requested}.`
          : `Your email is now ${requested}.`,

        // description: user.emailVerified ? "We sent a confirmation link. Your email changes once you approve it." : "Your email address has been changed.",
      },
    });

    if (ok) {
      setNewEmail("");
      router.refresh();
    }
  };

  // Handle Password Function
  const handlePassword = async (e) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    // const userData = Object.fromEntries(formData.entries());

    // console.log("In the form data", userData);

    const form = e.currentTarget; // keep a reference, the event is gone after await
    const data = Object.fromEntries(new FormData(form));

    // console.log("Password change response:", data);
    // {currentPassword: '', newPassword: '', confirmPassword: '', revokeOthers: 'on'}

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both new password fields are identical.",
      });
      return;
    }

    // const currentPassword = String(data.currentPassword ?? "");
    // const newPassword = String(data.newPassword ?? "");

    // console.log("Current password exists:", !!currentPassword);
    // console.log("New password exists:", !!newPassword);
    // console.log("Passwords match:", currentPassword === newPassword);

    if (data.newPassword === data.currentPassword) {
      // console.log("Password validation failed");

      toast.error("Choose a different password", {
        description: "Your new password must differ from the current one.",
      });

      return;
    }

    const ok = await run({
      key: "password",
      loading: "Updating your password...",
      errorTitle: "Password change failed",
      logLabel: "Password update",

      action: () =>
        // authClient.changePassword({
        changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: data.revokeOthers === "on",
        }),

      /* const { data, error } = await authClient.changePassword({
            newPassword: "newpassword1234", // required, The new password to set
            currentPassword: "oldpassword1234", // required, The current user password
            revokeOtherSessions: true, // When set to true, all other active sessions for this user will be invalidated
        });
      */

      success: {
        title: "Password updated",
        description:
          data.revokeOthers === "on"
            ? "You were signed out of your other devices."
            : "Your password has been changed.",
      },
    });

    if (ok) {
      form.reset();
      setNewPassword("");
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Aurora background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="aurora-1 absolute -left-1/4 -top-1/4 size-[55vmax] rounded-full bg-violet-600/25 blur-[120px]" />

        <div className="aurora-2 absolute -right-1/4 top-1/3 size-[45vmax] rounded-full bg-lime-400/10 blur-[130px]" />

        <div className="aurora-3 absolute -bottom-1/3 left-1/3 size-[50vmax] rounded-full bg-cyan-500/15 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at 50% 20%, black 5%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 20%, black 5%, transparent 70%)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-30 border-b border-white/10 bg-[#05060a]/50 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                <ShieldCheck size={22} />
              </span>

              <span className="hidden text-base font-bold tracking-tight sm:block">
                NextAuth <span className="text-lime-300">Pro</span>
              </span>
            </Link>

            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-lime-300/40 hover:text-white"
            >
              <ArrowLeft
                size={15}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Home
            </Link>
          </div>

          <UserMenu user={user} />
        </nav>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* ============ Hero card ============ */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="relative h-32 overflow-hidden bg-linear-to-br from-violet-600/50 via-indigo-600/30 to-cyan-500/20 sm:h-40">
            <div className="absolute -left-10 -top-16 size-56 rounded-full bg-violet-500/50 blur-3xl" />

            <div className="absolute -right-10 top-0 size-48 rounded-full bg-lime-300/25 blur-3xl" />

            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                maskImage: "linear-gradient(to bottom, black, transparent 90%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 90%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#05060a]/80 to-transparent" />
          </div>

          <div className="relative px-6 pb-7 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
              <span className="pf-ring inline-block self-start rounded-full p-1 shadow-[0_10px_40px_rgba(124,58,237,0.4)]">
                <span className="block rounded-full bg-[#05060a] p-1">
                  <Avatar
                    user={user}
                    size="size-24 sm:size-28"
                    text="text-3xl"
                  />
                </span>
              </span>

              <div className="min-w-0 flex-1 sm:pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.name}
                  </h1>

                  {user.emailVerified && (
                    <BadgeCheck
                      size={22}
                      className="shrink-0 text-lime-300"
                      aria-label="Verified email"
                    />
                  )}
                </div>

                <p className="mt-1 truncate text-sm text-slate-400">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:pb-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    user.emailVerified
                      ? "border-lime-300/25 bg-lime-300/10 text-lime-200"
                      : "border-amber-300/25 bg-amber-300/10 text-amber-200"
                  }`}
                >
                  <ShieldCheck size={13} />
                  {user.emailVerified ? "Email verified" : "Email not verified"}
                </span>

                {memberSince && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                    <CalendarDays size={13} />
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ Body ============ */}
        <div className="mt-6 grid gap-6 md:grid-cols-[290px_1fr]">
          {/* ---- Sidebar ---- */}
          <aside className="space-y-6">
            <nav
              aria-label="Profile sections"
              // className="flex flex-wrap"
              className="flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-white/3 p-1 backdrop-blur-2xl md:flex-col md:overflow-visible sm:p-1.5 md:p-2"
            >
              {tabs.map(({ id, label, hint, icon: Icon }) => {
                const active = tab === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex shrink-0 cursor-pointer items-center gap-1.5 overflow-hidden rounded-2xl px-2 py-1.5 text-left transition-all duration-300 md:w-full md:px-3.5 md:py-3 md:gap-3 ${
                      active
                        ? "bg-linear-to-r from-lime-300/15 to-violet-500/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-3 left-0 w-0.5 rounded-full bg-lime-300 transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-xl border transition-all duration-300 sm:size-7 md:size-10 ${
                        active
                          ? "border-lime-300/30 bg-lime-300/15 text-lime-200"
                          : "border-white/10 bg-white/4 text-slate-400 group-hover:text-violet-300"
                      }`}
                    >
                      <Icon
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5"
                        // size={18}
                      />
                    </span>

                    <span className="pr-0 sm:pr-1 md:pr-2">
                      <span className="block text-xs font-semibold md:text-sm">
                        {label}
                      </span>

                      <span className="hidden text-xs text-slate-500 md:block">
                        {hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Completeness */}
            <div className="hidden rounded-3xl border border-white/10 bg-white/3 p-5 backdrop-blur-2xl md:block">
              <div className="flex items-center gap-4">
                <CompletenessRing value={completeness} />

                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <Sparkles size={14} className="text-lime-300" />
                    Profile strength
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {completeness === 100
                      ? "Everything is set up."
                      : "Finish the steps below."}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {checks.map(({ label, done }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`grid size-5 place-items-center rounded-full ${
                        done
                          ? "bg-lime-300/20 text-lime-300"
                          : "bg-white/5 text-transparent ring-1 ring-white/15"
                      }`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>

                    <span
                      className={done ? "text-slate-200" : "text-slate-500"}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ---- Panels ---- */}
          <div key={tab}>
            {/* ACCOUNT */}
            {tab === "account" && (
              <Panel
                icon={UserRound}
                title="Account details"
                description="This name is shown across the app."
              >
                <Form className="flex flex-col gap-6" onSubmit={handleName}>
                  <IconField
                    name="name"
                    label="Full name"
                    icon={UserRound}
                    placeholder="Your name"
                    autoComplete="name"
                    value={name}
                    onChange={setName}
                    validate={(v) =>
                      v.trim().length < 3
                        ? "Name must be at least 3 characters"
                        : null
                    }
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <SubmitButton
                      loading={busy === "name"}
                      disabled={!nameDirty || Boolean(busy)}
                      loadingText="Saving..."
                    >
                      Save changes
                    </SubmitButton>

                    {nameDirty && (
                      <button
                        type="button"
                        onClick={() => setName(user.name ?? "")}
                        className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
                      >
                        Discard
                      </button>
                    )}
                  </div>
                </Form>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Sign-in methods
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {providers.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-slate-300"
                      >
                        <span className="size-1.5 rounded-full bg-lime-300" />
                        {providerNames[p] ?? p}
                      </span>
                    ))}
                  </div>
                </div>
              </Panel>
            )}

            {/* EMAIL */}
            {tab === "email" && (
              <Panel
                icon={Mail}
                title="Email address"
                description="Change the address you use to sign in and receive messages."
              >
                {/* Current email card */}
                <div className="mb-6 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/3 p-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet-500/15 text-violet-300 sm:size-10">
                    <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500">Current email</p>
                    <p className="truncate text-xs font-semibold sm:text-sm">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold sm:px-2.5 ${
                      user.emailVerified
                        ? "bg-lime-300/10 text-lime-300"
                        : "bg-amber-300/10 text-amber-200"
                    }`}
                  >
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                {/* Unverified banner: now outside the card */}
                {!user.emailVerified && (
                  <div
                    role="alert"
                    className="mb-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-300/15 text-amber-200">
                        <MailWarning size={18} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-amber-100">
                          Your email isn't verified
                        </p>
                        <p className="mt-1 text-xs leading-5 text-amber-200/70">
                          Verify it to secure your account and enable email
                          changes. The link expires in 7 days.
                        </p>

                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={cooldown > 0 || Boolean(busy)}
                          className="group mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busy === "resend" ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : (
                            <RefreshCw
                              size={16}
                              className="transition-transform duration-500 group-hover:rotate-180"
                            />
                          )}
                          {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : "Resend verification email"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <Form className="flex flex-col gap-6" onSubmit={handleEmail}>
                  <IconField
                    name="newEmail"
                    label="New email address"
                    icon={Mail}
                    placeholder="new@example.com"
                    autoComplete="email"
                    value={newEmail}
                    onChange={setNewEmail}
                    hint={
                      user.emailVerified
                        ? "We'll send an approval link to your current email, then verify the new one."
                        : "Your email will be updated right away."
                    }
                    validate={(v) =>
                      !emailRegex.test(v)
                        ? "Please enter a valid email address"
                        : v.trim().toLowerCase() === user.email.toLowerCase()
                          ? "That's already your email"
                          : null
                    }
                  />

                  <div>
                    <SubmitButton
                      icon={Mail}
                      loading={busy === "email"}
                      disabled={!emailReady || Boolean(busy)}
                      loadingText="Updating..."
                    >
                      Update email
                    </SubmitButton>
                  </div>
                </Form>
              </Panel>
            )}

            {/* SECURITY */}
            {tab === "security" && (
              <Panel
                icon={KeyRound}
                title="Password & security"
                description="Use a long, unique password you don't use anywhere else."
              >
                {!hasPassword ? (
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <div className="flex items-start gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                        <LockKeyhole size={20} />
                      </span>

                      <div>
                        <p className="font-semibold">
                          No password on this account
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          You sign in with{" "}
                          {providers
                            .map((p) => providerNames[p] ?? p)
                            .join(", ")}
                          , so there's no password to change. Your security is
                          managed by that provider.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form
                    className="flex flex-col gap-5"
                    onSubmit={handlePassword}
                  >
                    <IconField
                      name="currentPassword"
                      label="Current password"
                      icon={LockKeyhole}
                      type={show.current ? "text" : "password"}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                      trailing={
                        <RevealButton
                          shown={show.current}
                          onToggle={() => toggle("current")}
                        />
                      }
                    />

                    <IconField
                      name="newPassword"
                      label="New password"
                      icon={KeyRound}
                      type={show.next ? "text" : "password"}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      onChange={setNewPassword}
                      hint="At least 8 characters with 1 uppercase and 1 number"
                      trailing={
                        <RevealButton
                          shown={show.next}
                          onToggle={() => toggle("next")}
                        />
                      }
                      validate={(v) => {
                        if (v.length < 8)
                          return "Password must be at least 8 characters";
                        if (!/[A-Z]/.test(v))
                          return "Password must contain at least one uppercase letter";
                        if (!/[0-9]/.test(v))
                          return "Password must contain at least one number";
                        return null;
                      }}
                    >
                      {newPassword && (
                        <div className="mt-3">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                  strength >= level
                                    ? strengthColor
                                    : "bg-white/10"
                                }`}
                              />
                            ))}
                          </div>

                          <p className="mt-2 text-xs text-slate-400">
                            Password strength:{" "}
                            <span className="font-medium text-slate-200">
                              {strengthLabel}
                            </span>
                          </p>
                        </div>
                      )}
                    </IconField>

                    <IconField
                      name="confirmPassword"
                      label="Confirm new password"
                      icon={KeyRound}
                      type={show.confirm ? "text" : "password"}
                      placeholder="Repeat your new password"
                      autoComplete="new-password"
                      trailing={
                        <RevealButton
                          shown={show.confirm}
                          onToggle={() => toggle("confirm")}
                        />
                      }
                      validate={(v) =>
                        v !== newPassword ? "Passwords do not match." : null
                      }
                    />

                    {/* Native checkbox, read through FormData */}
                    <label className="group flex w-fit cursor-pointer select-none items-center gap-3">
                      <input
                        type="checkbox"
                        name="revokeOthers"
                        defaultChecked
                        className="peer sr-only"
                      />

                      <span className="grid size-5 place-items-center rounded-md border border-white/20 bg-white/4 text-transparent transition-all duration-200 group-hover:border-lime-300/60 peer-checked:border-lime-300 peer-checked:bg-lime-300 peer-checked:text-[#0b0c0e] peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0a0b12]">
                        <Check size={13} strokeWidth={3.5} />
                      </span>

                      <span className="text-sm text-slate-300">
                        Sign me out of all other devices
                      </span>
                    </label>

                    <div>
                      <SubmitButton
                        icon={ShieldCheck}
                        loading={busy === "password"}
                        disabled={Boolean(busy)}
                        loadingText="Updating..."
                      >
                        Update password
                      </SubmitButton>
                    </div>
                  </Form>
                )}
              </Panel>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @property --pf-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes pf-spin { to { --pf-angle: 360deg; } }
        @keyframes pf-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift-1 { 50% { transform: translate(8vmax, 6vmax) scale(1.1); } }
        @keyframes drift-2 { 50% { transform: translate(-7vmax, 8vmax) scale(1.15); } }
        @keyframes drift-3 { 50% { transform: translate(6vmax, -7vmax) scale(1.1); } }

        .pf-ring {
          background: conic-gradient(from var(--pf-angle), #8b5cf6, #22d3ee, #bef264, #8b5cf6);
          animation: pf-spin 6s linear infinite;
        }
        .pf-in { animation: pf-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .aurora-1 { animation: drift-1 22s ease-in-out infinite; }
        .aurora-2 { animation: drift-2 26s ease-in-out infinite; }
        .aurora-3 { animation: drift-3 30s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .pf-ring, .pf-in, .aurora-1, .aurora-2, .aurora-3 { animation: none; }
        }
      `}</style>
    </main>
  );
}
