"use client";

import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MailCheck,
  MoveRight,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  SquareArrowOutUpRight,
  UserPlus,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { emailExists } from "@/app/actions/check-email";
import { signIn, signUp } from "@/lib/auth-client";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/4 pl-11 text-white placeholder:text-slate-500 transition focus-within:border-lime-300/60 focus-within:bg-white/6 focus-within:ring-4 focus-within:ring-lime-300/10";

const providerNames = { google: "Google", github: "GitHub" };
const RESEND_COOLDOWN = 60;

const steps = [
  {
    title: "Create your account",
    text: "Use email, Google or GitHub. It takes under a minute.",
  },
  {
    title: "Sign in securely",
    text: "Your session is handled by Better Auth.",
  },
  {
    title: "Start building",
    text: "Jump straight into your workspace.",
  },
];

const getStrength = (value) =>
  [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
        transform="translate(3 3) scale(.875)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.95 46.98 31.9 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.8 23.8 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
        transform="translate(3 3) scale(.875)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
        transform="translate(3 3) scale(.875)"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.23-5.07-5.49 0-1.21.43-2.2 1.15-2.97-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.72.77 1.15 1.76 1.15 2.97 0 4.27-2.6 5.21-5.08 5.48.4.35.76 1.02.76 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
        <ShieldCheck size={22} />
      </span>

      <span className="text-base font-bold tracking-tight">
        NextAuth <span className="text-lime-300">Pro</span>
      </span>
    </Link>
  );
}

function VerifyNotice({ email, cooldown, resending, onResend, onBack }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-lime-300/25 bg-lime-300/10 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <MailCheck size={28} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight">
        Verify your{" "}
        <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
          email
        </span>
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        We sent a verification link to{" "}
        <span className="font-semibold text-slate-200">{email}</span>. Click it
        to activate your account. It expires in 7 days.
      </p>

      {/* <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-4 text-left text-xs leading-5 text-slate-400">
        Nothing yet? Check your spam folder, or make sure the address is spelled
        correctly.
      </div> */}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-4 text-left text-xs leading-5 text-slate-400">
        Nothing yet? Check your spam folder. If you already have an account with
        this email, you won&apos;t get a new link.{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-lime-300 hover:underline"
        >
          Sign in
        </Link>{" "}
        or{" "}
        <Link
          href="/forgot-password"
          className="font-semibold text-lime-300 hover:underline"
        >
          reset your password
        </Link>
        .
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="secondary"
          isDisabled={cooldown > 0 || resending}
          onPress={onResend}
          className="h-12 rounded-2xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
        </Button>

        <Link
          href="/sign-in"
          className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)]"
        >
          Go to sign in
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Use a different email
        </button>
      </div>
    </div>
  );
}

export default function SignUpForm() {
  const router = useRouter();
  const cardRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const [sentTo, setSentTo] = useState(""); // set after a successful sign-up
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Only for the strength meter + confirm validation
  const [password, setPassword] = useState("");
  const strength = getStrength(password);

  const strengthLabel =
    strength <= 2 ? "Weak" : strength <= 3 ? "Medium" : "Strong";

  const strengthColor =
    strength <= 2
      ? "bg-rose-400"
      : strength <= 3
        ? "bg-amber-400"
        : "bg-lime-300";

  const busy = loading || Boolean(socialLoading);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    const reset = () => setSocialLoading("");
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  // Cursor spotlight: writes CSS variables, no React state involved
  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  /* const handleReset = () => {
    setPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }; */

  /* Email and Password Function */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()); // Convert FormData to plain object

    // console.log("data from the form", data);

    // const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both password fields are identical.",
      });

      return;
    }

    const email = String(data.email).trim().toLowerCase();

    setLoading(true);

    const toastId = toast.loading("Creating your account...", {
      description: "This will only take a moment.",
    });

    try {
      if (await emailExists(email)) {
        toast.error("Account already exists", {
          id: toastId,
          description: "This email is already registered. Sign in instead.",
          action: { label: "Sign in", onClick: () => router.push("/sign-in") },
        });
        return;
      }

      const { error } = await signUp.email({
        name: data.name,
        // email: data.email,
        email,
        password: data.password,
        callbackURL: "/", // where the verification link sends them
      });

      if (error) {
        toast.error("Sign up failed", {
          id: toastId,
          description: error.message || "Unable to create your account.",
        });
        return;
      }

      toast.success("Account created", {
        id: toastId,
        description: "Check your inbox to verify your email.",
        // description: "Welcome aboard! Redirecting you now...",
      });

      setSentTo(email);
      setCooldown(RESEND_COOLDOWN);
      setPassword("");

      // router.push("/");
      // router.refresh();
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    const toastId = toast.loading("Sending verification email...");

    try {
      const { error } = await sendVerificationEmail({
        email: sentTo,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Couldn't send the email", {
          id: toastId,
          description: error.message || "Please try again.",
        });
        return;
      }

      toast.success("Verification email sent", {
        id: toastId,
        description: `Check ${sentTo}, including your spam folder.`,
      });
      setCooldown(RESEND_COOLDOWN);
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setResending(false);
    }
  };

  /* Github and Google Function */
  const handleSocialSignUp = async (provider) => {
    setSocialLoading(provider);

    const providerName = providerNames[provider] ?? provider;
    const toastId = toast.loading(`Connecting to ${providerName}...`, {
      description: "You'll be redirected shortly.",
    });

    try {
      // Better Auth has no signUp.social: signIn.social creates the
      // account automatically if the user doesn't exist yet.
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(`${providerName} sign-up failed`, {
          id: toastId,

          description:
            error.message || `Unable to sign up with ${providerName}.`,
        });

        setSocialLoading("");
      }
      // On success the browser redirects to the provider.
    } catch {
      toast.error("Social sign-up failed", {
        id: toastId,

        description: "Please try again.",
      });

      setSocialLoading("");
    }
  };

  return (
    <main className="relative isolate grid min-h-screen overflow-hidden bg-[#05060a] text-white md:grid-cols-[1fr_1.1fr]">
      {/* Shared aurora background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="aurora-1 absolute -right-1/4 -top-1/4 size-[60vmax] rounded-full bg-fuchsia-600/25 blur-[120px]" />

        <div className="aurora-2 absolute -left-1/4 top-1/4 size-[45vmax] rounded-full bg-lime-400/10 blur-[130px]" />

        <div className="aurora-3 absolute -bottom-1/3 right-1/4 size-[50vmax] rounded-full bg-violet-500/25 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at 70% 40%, black 5%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 70% 40%, black 5%, transparent 70%)",
          }}
        />
      </div>

      {/* ============ LEFT: form panel ============ */}
      <section className="relative flex min-h-screen flex-col lg:border-r lg:border-white/10 lg:bg-[#05060a]/60 lg:backdrop-blur-xl">
        <header className="flex items-center justify-between px-5 py-6 sm:px-8">
          <div className="md:hidden">
            <Brand />
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm md:hidden lg:flex lg:ml-0 lg:w-full lg:justify-end">
            <span className="hidden text-slate-400 sm:inline">
              Already a member?
            </span>

            <Link
              href="/sign-in"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-violet-400/20 bg-white/4 px-4 py-2 font-semibold text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_24px_rgba(139,92,246,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/6 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative">Sign in</span>

              <MoveRight
                size={15}
                className="relative transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* <Link
              href="/sign-in"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 backdrop-blur-xl transition hover:border-lime-300/40 hover:bg-white/10 hover:text-white"
            >
              Sign in
              <MoveRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link> */}
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-6">
          <div className="w-full max-w-120">
            <div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              className="spin-border rounded-[28px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            >
              {/* <div className="relative overflow-hidden rounded-[27px] bg-[#0a0b12]/90 p-6 backdrop-blur-2xl sm:p-9"> */}

              <div className="relative overflow-hidden rounded-[27px] bg-[#0a0b12] p-6 backdrop-blur-2xl sm:p-9">
                <div className="spotlight pointer-events-none absolute inset-0" />

                <div className="relative">
                  {sentTo ? (
                    <VerifyNotice
                      email={sentTo}
                      cooldown={cooldown}
                      resending={resending}
                      onResend={handleResend}
                      onBack={() => setSentTo("")}
                    />
                  ) : (
                    <>
                      {/* Heading */}
                      <div className="mb-7 text-center">
                        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-lime-300/20 to-violet-500/20 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                          <UserPlus size={28} />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight">
                          Create your{" "}
                          <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                            account
                          </span>
                        </h1>

                        <Description className="mt-2 text-sm text-slate-400">
                          Fill in your details to get started.
                        </Description>
                      </div>

                      {/* Form */}
                      <Form
                        className="flex flex-col gap-5"
                        onSubmit={handleSubmit}
                        // onReset={handleReset}
                      >
                        <Fieldset className="w-full">
                          <FieldGroup className="gap-4">
                            {/* Name */}
                            <TextField
                              name="name"
                              isRequired
                              validate={(value) =>
                                value.trim().length < 3
                                  ? "Name must be at least 3 characters"
                                  : null
                              }
                            >
                              <Label className="mb-2 block text-sm font-medium text-slate-300">
                                Full name
                              </Label>

                              <div className="relative w-full">
                                <UserRound
                                  size={17}
                                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                                />

                                <Input
                                  fullWidth
                                  className={inputClass}
                                  placeholder="Your name"
                                  autoComplete="name"
                                />
                              </div>

                              <FieldError />
                            </TextField>

                            {/* Email */}
                            <TextField
                              name="email"
                              type="email"
                              isRequired
                              validate={(value) =>
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                  value,
                                )
                                  ? null
                                  : "Please enter a valid email address"
                              }
                            >
                              <Label className="mb-2 block text-sm font-medium text-slate-300">
                                Email
                              </Label>

                              <div className="relative w-full">
                                <Mail
                                  size={17}
                                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                                />

                                <Input
                                  fullWidth
                                  className={inputClass}
                                  placeholder="you@example.com"
                                  autoComplete="email"
                                />
                              </div>

                              <FieldError />
                            </TextField>

                            {/* Password */}
                            <TextField
                              className="w-full"
                              name="password"
                              isRequired
                              onChange={setPassword}
                              validate={(value) => {
                                if (value.length < 8)
                                  return "Password must be at least 8 characters";
                                if (!/[A-Z]/.test(value))
                                  return "Password must contain at least one uppercase letter";
                                if (!/[0-9]/.test(value))
                                  return "Password must contain at least one number";
                                return null;
                              }}
                            >
                              <Label className="mb-2 block text-sm font-medium text-slate-300">
                                Password
                              </Label>

                              <div className="relative w-full">
                                <LockKeyhole
                                  size={17}
                                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                                />

                                <Input
                                  fullWidth
                                  className={`${inputClass} pr-12`}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a strong password"
                                  autoComplete="new-password"
                                />

                                <button
                                  type="button"
                                  aria-label={
                                    showPassword
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition hover:text-white"
                                >
                                  {showPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>

                              <Description className="mt-2 text-xs text-slate-500">
                                At least 8 characters with 1 uppercase and 1
                                number
                              </Description>

                              <FieldError />

                              {password && (
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
                            </TextField>

                            {/* Confirm password */}
                            <TextField
                              className="w-full"
                              name="confirmPassword"
                              isRequired
                              validate={(value) =>
                                value !== password
                                  ? "Passwords do not match."
                                  : null
                              }
                            >
                              <Label className="mb-2 block text-sm font-medium text-slate-300">
                                Confirm password
                              </Label>

                              <div className="relative w-full">
                                <LockKeyhole
                                  size={17}
                                  className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                                />

                                <Input
                                  fullWidth
                                  className={`${inputClass} pr-12`}
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Confirm your password"
                                  autoComplete="new-password"
                                />

                                <button
                                  type="button"
                                  aria-label={
                                    showConfirmPassword
                                      ? "Hide confirm password"
                                      : "Show confirm password"
                                  }
                                  onClick={() =>
                                    setShowConfirmPassword((prev) => !prev)
                                  }
                                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 transition hover:text-white"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                  ) : (
                                    <Eye size={18} />
                                  )}
                                </button>
                              </div>
                              <FieldError />
                            </TextField>
                          </FieldGroup>
                        </Fieldset>

                        {/* Submit Neo-Glass Button */}
                        <div className="flex items-stretch gap-3">
                          <Button
                            type="submit"
                            isDisabled={busy}
                            className="group relative w-full h-12 overflow-hidden rounded-xl border border-violet-400/25 bg-[#171323] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-violet-400/60 hover:bg-[#211a35] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_25px_rgba(139,92,246,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-violet-500/8 via-fuchsia-400/4 to-indigo-500/8 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                            <span className="pointer-events-none absolute -left-1/2 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-violet-300 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />

                            <span className="relative flex items-center justify-center gap-2.5">
                              {loading ? (
                                <>
                                  <LoaderCircle
                                    size={18}
                                    className="animate-spin text-violet-300"
                                  />
                                  Creating account...
                                </>
                              ) : (
                                <>
                                  <span className="flex size-7 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-400/10 text-violet-300 transition-all duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-400/20">
                                    <UserPlus size={16} />
                                  </span>

                                  <span className="tracking-wide">
                                    Create Account
                                  </span>

                                  <ArrowRight
                                    size={17}
                                    className="text-violet-300 transition-transform duration-300 group-hover:translate-x-1"
                                  />
                                </>
                              )}
                            </span>
                          </Button>

                          {/* Reset Button */}
                          <Button
                            type="reset"
                            variant="secondary"
                            isDisabled={busy}
                            aria-label="Reset form"
                            className="group relative h-12 flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 font-semibold text-slate-300 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25),6px_6px_16px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-violet-400/40 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.3),8px_8px_20px_rgba(0,0,0,0.4),-5px_-5px_14px_rgba(255,255,255,0.05),0_0_22px_rgba(139,92,246,0.15)] active:scale-[0.97] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.45),inset_-3px_-3px_8px_rgba(255,255,255,0.05)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {/* Soft glass sheen */}
                            <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Light sweep on hover */}
                            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                            <span className="relative flex items-center gap-2">
                              <span className="flex size-7 items-center justify-center rounded-lg bg-white/4 text-violet-300 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:text-violet-200">
                                <RotateCcw
                                  size={15}
                                  className="transition-transform duration-500 group-hover:-rotate-180"
                                />
                              </span>

                              <span className="hidden tracking-wide sm:inline">
                                Reset
                              </span>
                            </span>
                          </Button>
                        </div>
                      </Form>

                      {/* Divider */}
                      <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/15" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          or continue with
                        </span>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/15" />
                      </div>

                      {/* Social sign-up */}
                      <div className="grid lg:grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          isDisabled={busy}
                          onPress={() => handleSocialSignUp("google")}
                          className="w-full h-10 rounded-xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {socialLoading === "google" ? (
                            <LoaderCircle size={18} className="animate-spin" />
                          ) : (
                            <GoogleIcon />
                          )}
                          Continue with Google
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          isDisabled={busy}
                          onPress={() => handleSocialSignUp("github")}
                          className="w-full h-10 rounded-2xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {socialLoading === "github" ? (
                            <LoaderCircle size={18} className="animate-spin" />
                          ) : (
                            <GithubIcon />
                          )}
                          Continue with GitHub
                        </Button>
                      </div>

                      {/* <p className="mt-7 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="rounded-md font-semibold text-white underline decoration-lime-300/50 underline-offset-4 transition hover:decoration-lime-300"
                    >
                      Sign in
                    </Link>
                  </p> */}

                      <div className="mt-7 flex items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                        <span className="text-slate-400">
                          Already have an account?
                        </span>

                        <Link
                          href="/sign-in"
                          className="group inline-flex items-center gap-1.5 font-semibold text-violet-300 transition-colors duration-300 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-md"
                        >
                          Sign In
                          <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="px-5 pb-6 text-center text-xs leading-6 text-slate-500 sm:px-8">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-300 hover:text-lime-400 hover:underline underline-offset-4 decoration-1 transition-colors duration-200 ease-in-out"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-slate-300 hover:text-lime-400 hover:underline underline-offset-4 decoration-1 transition-colors duration-200 ease-in-out"
          >
            Privacy Policy
          </Link>
          .
        </footer>

        {/* Developer */}
        <div className="flex items-center justify-center pb-6 lg:hidden">
          <p className="group relative flex flex-wrap items-center text-xs sm:text-sm">
            {/* Glass credit pill */}
            <span className="relative inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-500/30 bg-slate-900/60 px-2 py-3 shadow-[0_0_25px_rgba(139,92,246,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-lime-400/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] sm:px-3">
              {/* Copyright and project name */}
              <span className="text-slate-400">
                © {new Date().getFullYear()} NextAuth Pro
              </span>

              {/* <span
                aria-hidden="true"
                className="inline-block h-1 w-1 rounded-full bg-slate-600"
              /> */}

              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-linear-to-br from-slate-400 via-slate-600 to-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.3)] ring-1 ring-slate-950/10"
              />

              {/*  <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-slate-50 ring-4 ring-slate-500/10 dark:ring-slate-400/10 transition-all duration-300"
              /> */}

              <span className="text-slate-400">Programmed by</span>

              {/* Portfolio link */}
              <a
                href="https://marleydip.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Md Sofian Hasan's portfolio (opens in a new tab)"
                className="group/link inline-flex items-center gap-1.5 rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                <span className="bg-linear-to-r from-violet-400 via-purple-300 to-lime-300 bg-clip-text text-transparent transition-all duration-300 group-hover/link:from-lime-300 group-hover/link:via-violet-300 group-hover/link:to-fuchsia-400">
                  Md Sofian Hasan
                </span>

                {/* External link icon */}
                <SquareArrowOutUpRight
                  strokeWidth={1.8}
                  className="size-3 shrink-0 text-lime-300 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 sm:size-4"
                />
              </a>
            </span>
          </p>
        </div>
      </section>

      {/* ============ RIGHT: brand panel ============ */}
      <aside className="relative hidden flex-col justify-between p-10 xl:p-14 md:flex">
        <div className="flex justify-end">
          <Brand />
        </div>

        <div className="ml-auto w-full max-w-xl py-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
            <Sparkles size={15} className="text-lime-300" />
            Next.js · HeroUI · Better Auth
          </div>

          <h2 className="text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
            Start in{" "}
            <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              seconds, not hours.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Join us and get secure access to your workspace. No clutter, just a
            fast way in.
          </p>

          {/* Timeline */}
          <ol className="relative mt-12 space-y-8 border-l border-white/10 pl-8">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="relative">
                <span className="absolute -left-12.25 grid size-9 place-items-center rounded-full border border-white/10 bg-[#0a0b12] text-sm font-bold text-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.15)]">
                  {i + 1}
                </span>

                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </li>
            ))}
          </ol>

          {/* Decorative card */}
          <div className="float-a mt-12 hidden max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:block">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-lime-300 to-emerald-400 text-[#0b0c0e]">
                <Check size={22} strokeWidth={3} />
              </span>

              <div>
                <p className="text-sm font-semibold">Account ready</p>
                <p className="text-xs text-slate-400">Welcome to the team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer */}
        <div className="hidden lg:flex justify-end">
          <p className="group relative flex flex-wrap items-center gap-2 text-xs sm:gap-3 xl:text-sm">
            {/* Decorative gradient line */}
            <span
              aria-hidden="true"
              className="hidden h-px w-12 bg-linear-to-r from-violet-500 via-lime-300 to-transparent xl:block sm:w-20"
            />

            {/* Sparkle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="url(#footer-sparkle)"
              aria-hidden="true"
              className="size-5 shrink-0 text-violet-400 transition-transform duration-500 group-hover:rotate-45 xl:size-7"
            >
              <defs>
                <linearGradient id="footer-sparkle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#a3e635" />
                </linearGradient>
              </defs>

              <path d="M12 0 15.2 8.8 24 12l-8.8 3.2L12 24l-3.2-8.8L0 12l8.8-3.2L12 0Z" />
            </svg>

            {/* Glass credit pill */}
            <span className="relative inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-violet-500/30 bg-slate-900/60 px-3 py-3 shadow-[0_0_25px_rgba(139,92,246,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-lime-400/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] xl:gap-x-3 xl:px-5 xl:py-3">
              {/* Copyright and project name */}
              <span className="text-slate-400">
                © {new Date().getFullYear()} NextAuth Pro
              </span>

              {/* Dot */}
              <span
                className="relative flex h-2 w-2 items-center justify-center"
                aria-hidden="true"
              >
                {/* Outer ambient glow ring */}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-45" />
                {/* Soft static ring */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-500/20" />
                {/* Ultra-sharp premium inner core */}
                <span className="relative inline-block h-1 w-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
              </span>

              <span className="text-slate-400">Develop with passion by</span>

              {/* Portfolio link */}
              <a
                href="https://marleydip.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Md Sofian Hasan's portfolio (opens in a new tab)"
                className="group/link inline-flex items-center gap-1.5 rounded-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
              >
                <span className="bg-linear-to-r from-violet-400 via-purple-300 to-lime-300 bg-clip-text text-transparent transition-all duration-300 group-hover/link:from-lime-300 group-hover/link:via-violet-300 group-hover/link:to-fuchsia-400">
                  Md Sofian Hasan
                </span>

                {/* External link icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-lime-300 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 xl:size-5"
                >
                  <path d="M14 4h6v6" />
                  <path d="M20 4 10 14" />
                  <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
                </svg>
              </a>
            </span>
          </p>
        </div>

        {/* <p className="text-right text-xs text-slate-500">
          © {new Date().getFullYear()} NextAuth Pro · Develop with passion by{" "}
          <a
            href="https://marleydip.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-300 transition hover:text-lime-300"
          >
            Md Sofian Hasan
          </a>
        </p> */}
      </aside>

      {/* <style>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes spin-angle { to { --angle: 360deg; } }
        @keyframes drift-1 { 50% { transform: translate(-8vmax, 6vmax) scale(1.1); } }
        @keyframes drift-2 { 50% { transform: translate(7vmax, 8vmax) scale(1.15); } }
        @keyframes drift-3 { 50% { transform: translate(-6vmax, -7vmax) scale(1.1); } }
        @keyframes float-y { 50% { transform: translateY(-10px); } }

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
        .float-a { animation: float-y 6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .spin-border, .aurora-1, .aurora-2, .aurora-3, .float-a {
            animation: none;
          }
        }
      `}</style> */}
    </main>
  );
}
