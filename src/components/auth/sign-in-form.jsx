"use client";

import { signIn } from "@/lib/auth-client";
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
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Fingerprint,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/4 pl-11 text-white placeholder:text-slate-500 transition focus-within:border-lime-300/60 focus-within:bg-white/6 focus-within:ring-4 focus-within:ring-lime-300/10";

const providerNames = { google: "Google", github: "GitHub" };

const features = [
  {
    icon: ShieldCheck,
    title: "Secure sessions",
    text: "Protected by Better Auth, end to end.",
  },
  {
    icon: Zap,
    title: "Instant access",
    text: "Email, Google or GitHub in a couple of clicks.",
  },
  {
    icon: LockKeyhole,
    title: "Stay signed in",
    text: "Use Remember me on devices you trust.",
  },
];

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

export default function SignInForm() {
  const router = useRouter();
  const cardRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const busy = loading || Boolean(socialLoading);

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

  /* Email and Password Function */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const rememberMe = data.rememberMe === "on";

    setLoading(true);

    const toastId = toast.loading("Signing you in...", {
      description: "Verifying your credentials.",
    });

    try {
      // const { error } = await authClient.signIn.email({

      const { error } = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe,
        callbackURL: "/",
      });

      if (error) {
        toast.error("Sign in failed", {
          id: toastId,

          description:
            error.status === 403
              ? "Please verify your email address before signing in."
              : error.message || "Invalid email or password.",
        });

        return;
      }

      toast.success("Welcome back", {
        id: toastId,

        description: "Redirecting you now home page...",
      });

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong", {
        id: toastId,

        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* Google & Github Function */
  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);

    const providerName = providerNames[provider] ?? provider;
    const toastId = toast.loading(`Connecting to ${providerName}...`, {
      description: "You'll be redirected shortly.",
    });

    try {
      // const { error } = await authClient.signIn.social({

      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(`${providerName} sign-in failed`, {
          id: toastId,

          description:
            error.message || `Unable to sign in with ${providerName}.`,
        });

        setSocialLoading("");
      }
    } catch {
      toast.error("Social sign-in failed", {
        id: toastId,

        description: "Please try again.",
      });

      setSocialLoading("");
    }
  };

  return (
    <main className="relative isolate grid min-h-screen overflow-hidden bg-[#05060a] text-white md:grid-cols-[1.1fr_1fr]">
      {/* Shared aurora background (spans both halves) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="aurora-1 absolute -left-1/4 -top-1/4 size-[60vmax] rounded-full bg-violet-600/30 blur-[120px]" />

        <div className="aurora-2 absolute -right-1/4 top-0 size-[45vmax] rounded-full bg-lime-400/10 blur-[130px]" />

        <div className="aurora-3 absolute -bottom-1/3 left-1/4 size-[50vmax] rounded-full bg-cyan-500/20 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at 30% 40%, black 5%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 40%, black 5%, transparent 70%)",
          }}
        />
      </div>

      {/* ============ LEFT: brand panel ============ */}
      <aside className="relative hidden flex-col justify-between p-10 xl:p-14 md:flex">
        <Brand />

        <div className="md:max-w-120 xl:max-w-xl py-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
            <Sparkles size={15} className="text-lime-300" />
            Next.js · HeroUI · Better Auth
          </div>

          <h2 className="text-5xl font-bold leading-[1.1] tracking-tight xl:text-6xl">
            Secure access,{" "}
            <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              beautifully simple.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Sign in to pick up right where you left off. Fast, private and built
            for modern apps.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-lime-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                  <Icon size={22} />
                </span>

                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Decorative preview card (large screens only) */}
          <div className="float-a mt-12 hidden w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl xl:block">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-bold">
                You
              </span>

              <div>
                <p className="text-sm font-semibold">Your workspace</p>
                <p className="text-xs text-slate-400">Ready when you are</p>
              </div>

              <span className="ml-auto flex items-center gap-1.5 rounded-full bg-lime-300/10 px-2.5 py-1 text-[11px] font-medium text-lime-300">
                <span className="size-1.5 animate-pulse rounded-full bg-lime-300" />
                Secure
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {["Encrypted session", "Trusted device check"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/3 px-3 py-2.5 text-sm text-slate-300"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-lime-300/15 text-lime-300">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 text-xs text-slate-500 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NextAuth Pro
          </p>

          <p className="group text-xs text-slate-500">
            Develop with passion by{" "}
            <a
              href="https://marleydip.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-1.5 font-semibold text-slate-300 transition-all duration-300 hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-fuchsia-300 group-hover:to-violet-300">
                Md Sofian Hasan
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-3.5 text-violet-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>

              <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-violet-400 to-fuchsia-400 transition-all duration-300 group-hover:w-full" />
            </a>
          </p>
        </div>
      </aside>

      {/* ============ RIGHT: form panel ============ */}
      <section className="relative flex min-h-screen flex-col lg:border-l lg:border-white/10 lg:bg-[#05060a]/60 lg:backdrop-blur-xl">
        <header className="flex items-center justify-between px-4 py-6 sm:px-8 lg:justify-end">
          <div className="md:hidden">
            <Brand />
          </div>

          <div className="flex items-center gap-3 text-sm md:hidden lg:flex">
            <span className="hidden text-slate-400 sm:inline">New here?</span>
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-slate-200 backdrop-blur-xl transition hover:border-lime-300/40 hover:bg-white/10 hover:text-white"
            >
              Create account
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-6">
          <div className="w-full max-w-110">
            {/* Card with animated gradient border + spotlight */}
            <div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              className="spin-border rounded-[28px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            >
              <div className="relative overflow-hidden rounded-[27px] bg-[#0a0b12] p-6 backdrop-blur-2xl sm:p-9">
                <div className="spotlight pointer-events-none absolute inset-0" />

                <div className="relative">
                  {/* Heading */}
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-lime-300/20 to-violet-500/20 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                      <Fingerprint size={28} />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">
                      Welcome{" "}
                      <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
                        back
                      </span>
                    </h1>

                    <Description className="mt-2 text-sm text-slate-400">
                      Sign in to continue to your workspace.
                    </Description>
                  </div>

                  {/* Social first */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      isDisabled={busy}
                      onPress={() => handleSocialSignIn("google")}
                      className="h-12 rounded-2xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/8"
                    >
                      {socialLoading === "google" ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      isDisabled={busy}
                      onPress={() => handleSocialSignIn("github")}
                      className="h-12 rounded-2xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/8"
                    >
                      {socialLoading === "github" ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <GithubIcon />
                      )}
                      GitHub
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/15" />

                    <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                      or with email
                    </span>

                    <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/15" />
                  </div>

                  {/* Email & password form */}
                  <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Fieldset className="w-full">
                      <FieldGroup className="gap-4">
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
                          validate={(value) =>
                            value.length < 8
                              ? "Password must be at least 8 characters"
                              : null
                          }
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
                              placeholder="Enter your password"
                              autoComplete="current-password"
                            />

                            <button
                              type="button"
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-white hover:cursor-grab"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          <FieldError />
                        </TextField>

                        {/* Remember me & forgot password */}
                        <div className="flex items-center justify-between">
                          <label className="group flex cursor-pointer select-none items-center gap-2.5">
                            <input
                              type="checkbox"
                              name="rememberMe"
                              defaultChecked
                              className="peer sr-only"
                            />

                            <span className="grid size-5 place-items-center rounded-md border border-white/20 bg-white/4 text-transparent transition-all duration-200 group-hover:border-lime-300/60 peer-checked:border-lime-300 peer-checked:bg-lime-300 peer-checked:text-[#0b0c0e] peer-focus-visible:ring-2 peer-focus-visible:ring-lime-300/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#0a0b12]">
                              <Check size={13} strokeWidth={3.5} />
                            </span>

                            <span className="text-sm text-slate-300">
                              Remember me
                            </span>
                          </label>

                          <Link
                            href="/forgot-password"
                            className="rounded-md text-sm font-medium text-lime-300/90 transition hover:text-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300/60"
                          >
                            Forgot password?
                          </Link>
                        </div>
                      </FieldGroup>
                    </Fieldset>

                    {/* Submit */}
                    <Button
                      type="submit"
                      isDisabled={busy}
                      className="group relative h-12 w-full overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <LoaderCircle size={18} className="animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign in
                            <ArrowRight
                              size={18}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </>
                        )}
                      </span>
                    </Button>
                  </Form>

                  <p className="mt-7 text-center text-sm text-slate-400">
                    New here?{" "}
                    <Link
                      href="/sign-up"
                      className="rounded-md font-semibold text-white underline decoration-lime-300/50 underline-offset-4 transition hover:decoration-lime-300"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="px-5 pb-6 text-center text-xs leading-6 text-slate-500 sm:px-8">
          Protected by Better Auth. By continuing you agree to our{" "}
          <Link
            href="/terms"
            className="text-slate-300 hover:text-lime-400 hover:underline underline-offset-4 decoration-1 transition-colors duration-200 ease-in-out"
          >
            Terms
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
      </section>

      {/* <style>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        @keyframes spin-angle { to { --angle: 360deg; } }
        @keyframes drift-1 { 50% { transform: translate(8vmax, 6vmax) scale(1.1); } }
        @keyframes drift-2 { 50% { transform: translate(-7vmax, 8vmax) scale(1.15); } }
        @keyframes drift-3 { 50% { transform: translate(6vmax, -7vmax) scale(1.1); } }
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
