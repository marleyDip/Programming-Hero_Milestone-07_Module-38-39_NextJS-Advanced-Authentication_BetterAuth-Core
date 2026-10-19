"use client";

import { authClient } from "@/lib/auth-client";
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
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
  MoveRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const inputClass =
  "rounded-xl border border-white/15 bg-white/4 text-white shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20";

const providerNames = { google: "Google", github: "GitHub" };

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  // Re-enable buttons if the user comes back from the provider (bfcache)
  useEffect(() => {
    const reset = () => setSocialLoading("");
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const rememberMe = data.rememberMe === "on"; // unchecked boxes are absent from FormData

    setLoading(true);
    const toastId = toast.loading("Signing you in...", {
      description: "Verifying your credentials.",
    });

    try {
      const { error } = await authClient.signIn.email({
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
        description: "Redirecting you now...",
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

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);

    const providerName = providerNames[provider] ?? provider;
    const toastId = toast.loading(`Connecting to ${providerName}...`, {
      description: "You'll be redirected shortly.",
    });

    try {
      const { error } = await authClient.signIn.social({
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
      // On success the browser redirects to the provider.
    } catch {
      toast.error("Social sign-in failed", {
        id: toastId,
        description: "Please try again.",
      });
      setSocialLoading("");
    }
  };

  const busy = loading || Boolean(socialLoading);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090b18] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <ShieldCheck size={25} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">
              NextAuth <span className="text-violet-400">Pro</span>
            </p>
            <p className="text-xs text-slate-400">Secure · Fast · Modern</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 text-sm text-slate-400 sm:flex">
          <span className="text-slate-400/90">New here?</span>

          <Link
            href="/sign-up"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-violet-400/20 bg-white/4 px-4 py-2 font-semibold text-violet-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/6 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Create account</span>
            <MoveRight
              size={15}
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </header>

      {/* Main layout */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-16">
        {/* Intro panel */}
        <div className="hidden lg:block">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
            <LockKeyhole size={16} />
            Next.js & BetterAuth
          </div>

          <h1 className="max-w-lg text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
            Welcome{" "}
            <span className="bg-linear-to-r from-violet-400 via-indigo-300 to-lime-300 bg-clip-text text-transparent">
              back
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Sign in to pick up right where you left off. Your session is
            protected by BetterAuth.
          </p>

          <div className="mt-10 space-y-7">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Sessions",
                description: "Encrypted and protected end to end",
              },
              {
                icon: Zap,
                title: "Instant Access",
                description: "Back in your workspace in seconds",
              },
              {
                icon: LockKeyhole,
                title: "Stay Signed In",
                description: "Use Remember me on trusted devices",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-white/4 text-violet-300">
                  <Icon size={25} />
                </div>

                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-in card */}
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-white/4.5 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
                <LogIn size={29} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>

              <Description className="mt-2 text-sm leading-6 text-slate-400">
                Enter your credentials to access your account.
              </Description>
            </div>

            <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Fieldset className="w-full">
                <FieldGroup className="gap-5">
                  {/* Email */}
                  <TextField
                    name="email"
                    type="email"
                    isRequired
                    validate={(value) => {
                      if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                      ) {
                        return "Please enter a valid email address";
                      }
                      return null;
                    }}
                  >
                    <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <Mail size={16} />
                      Email Address
                    </Label>

                    <Input
                      className={inputClass}
                      placeholder="john@example.com"
                      autoComplete="email"
                    />

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
                    <div className="mb-2 flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <LockKeyhole size={16} />
                        Password
                      </Label>

                      <Link
                        href="/forgot-password"
                        className="rounded-md text-xs font-medium text-violet-300 transition-colors hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative w-full">
                      <Input
                        fullWidth
                        className={`${inputClass} w-full pr-12`}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
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

                  {/* Remember me (native checkbox, read via FormData) */}
                  <label className="group flex w-fit cursor-pointer select-none items-center gap-3">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      defaultChecked
                      className="peer sr-only"
                    />

                    <span className="grid size-5 shrink-0 place-items-center rounded-md border border-white/20 bg-white/4 text-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 group-hover:border-violet-400/60 peer-checked:border-violet-400 peer-checked:bg-violet-500 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-violet-400/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#090b18]">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12.5 10 17.5 19 7.5" />
                      </svg>
                    </span>

                    <span className="text-sm text-slate-300">Remember me</span>
                  </label>
                </FieldGroup>
              </Fieldset>

              {/* Submit Neo-Glass Button */}
              <Button
                type="submit"
                isDisabled={busy}
                className="group relative w-full overflow-hidden rounded-xl border border-violet-400/25 bg-[#171323] py-4.5 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-violet-400/60 hover:bg-[#211a35] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_25px_rgba(139,92,246,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
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
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span className="flex size-7 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-400/10 text-violet-300 transition-all duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-400/20">
                        <LogIn size={16} />
                      </span>

                      <span className="tracking-wide">Sign In</span>

                      <ArrowRight
                        size={17}
                        className="text-violet-300 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </span>
              </Button>
            </Form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social sign-in */}
            <div className="grid gap-3">
              <Button
                type="button"
                variant="secondary"
                isDisabled={busy}
                onPress={() => handleSocialSignIn("google")}
                className="w-full rounded-xl border border-white/10 bg-white/3 py-3 text-sm text-white transition hover:bg-white/8"
              >
                {socialLoading === "google" ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 48 48"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  >
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
                )}
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="secondary"
                isDisabled={busy}
                onPress={() => handleSocialSignIn("github")}
                className="w-full rounded-xl border border-white/10 bg-white/3 py-3 text-sm text-white transition hover:bg-white/8"
              >
                {socialLoading === "github" ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.71-1.49-2.47-.28-5.07-1.23-5.07-5.49 0-1.21.43-2.2 1.15-2.97-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.72.77 1.15 1.76 1.15 2.97 0 4.27-2.6 5.21-5.08 5.48.4.35.76 1.02.76 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>
                )}
                Continue with GitHub
              </Button>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
            <span className="text-slate-400">Don&apos;t have an account?</span>

            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-1.5 rounded-md font-semibold text-violet-300 transition-colors duration-300 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Sign Up
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-8 border-t border-white/10 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} NextAuth Pro</p>
          <p>Built with ❤️ using Next.js, HeroUI & BetterAuth</p>
        </div>
      </footer>
    </main>
  );
}
