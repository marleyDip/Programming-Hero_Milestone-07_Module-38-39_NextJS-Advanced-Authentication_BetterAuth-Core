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
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MoveRight,
  RotateCcw,
  ShieldCheck,
  UserPlus,
  UserRound,
  Zap,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useEffect, useState } from "react";

const inputClass =
  "rounded-xl border border-white/15 bg-white/4 text-white shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/20";

const getStrength = (value) =>
  [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  // Only for the strength meter + confirm validation
  const [password, setPassword] = useState("");
  const strength = getStrength(password);

  /* Email and Password Function */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()); // Convert FormData to plain object

    // console.log("data from the form", data);

    // const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both password fields are identical.",
      });

      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const { data: resData, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      // console.log(resData, error);

      if (error) {
        toast.error("Sign up failed", {
          id: toastId,
          description: error.message || "Unable to create your account.",
        });

        return;
      }

      toast.success("Account created", {
        id: toastId,
        description: "Welcome aboard! Redirecting you now...",
      });

      router.push("/");
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  // toast.promise (cleanest) - Sonner handles the loading, success, and error states
  /* const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both password fields are identical.",
      });
      return;
    }

    setLoading(true);

    toast.promise(
      authClient.signUp
        .email({
          name: data.name,
          email: data.email,
          password: data.password,
          callbackURL: "/",
        })
        .then(({ error }) => {
          // better-auth returns errors instead of throwing, so throw manually
          if (error)
            throw new Error(error.message || "Unable to create your account.");
        }),
      {
        loading: "Creating your account...",

        success: () => {
          router.push("/");
        
          return {
            message: "Account created",
            description: "Welcome aboard! Redirecting you now...",
          };
        },
        
        error: (err) => ({
          message: "Sign up failed",
          description: err.message,
        }),
        
        finally: () => setLoading(false),
      },
    );
  }; */

  /* Github and Google Function */
  const handleSocialSignUp = async (provider) => {
    setSocialLoading(provider);

    // const providerNames = { google: "Google", github: "GitHub" };
    // const providerName = providerNames[provider] ?? provider;

    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

    const toastId = toast.loading(`Connecting to ${providerName}...`, {
      description: "You'll be redirected shortly.",
    });

    try {
      const { error } = await authClient.signIn.social({
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

      // On success the browser redirects to the provider,
      // so there's nothing more to do here.
    } catch {
      toast.error("Social sign-up failed", {
        id: toastId,
        description: "Please try again.",
      });

      setSocialLoading("");
    }
  };

  useEffect(() => {
    const reset = () => setSocialLoading("");

    window.addEventListener("pageshow", reset);

    return () => window.removeEventListener("pageshow", reset);
  }, []);

  // Manual Reset
  /* const handleReset = () => {
    setPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }; */

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

        {/* Glassmorphism Pill Button */}
        <div className="hidden items-center gap-3 text-sm text-slate-400 sm:flex">
          <span className="text-slate-400/90">Already have an account?</span>

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
            Create your{" "}
            <span className="bg-linear-to-r from-violet-400 via-indigo-300 to-lime-300 bg-clip-text text-transparent">
              account
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Join us and start building something amazing. Get secure access with
            Next.js and BetterAuth.
          </p>

          <div className="mt-10 space-y-7">
            {[
              {
                icon: ShieldCheck,
                title: "Secure Authentication",
                description: "Powered by BetterAuth",
              },
              {
                icon: Zap,
                title: "Fast & Reliable",
                description: "Built for modern applications",
              },
              {
                icon: LockKeyhole,
                title: "Your Data, Your Control",
                description: "Privacy-focused access",
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

          <div className="mt-12 flex h-40 max-w-md items-center justify-center">
            <div className="relative grid size-32 place-items-center rounded-[2rem] border border-violet-400/30 bg-linear-to-br from-violet-500/20 to-indigo-500/5 shadow-[0_0_80px_rgba(139,92,246,0.18)]">
              <ShieldCheck size={66} className="text-violet-300" />
              <div className="absolute -right-3 -top-3 size-5 animate-pulse rounded-full bg-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.5)]" />
            </div>
          </div>
        </div>

        {/* Sign-up card */}
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-white/4.5 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-violet-400/25 bg-violet-500/15 text-violet-300">
                <UserPlus size={29} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Create Account
              </h2>

              <Description className="mt-2 text-sm leading-6 text-slate-400">
                Fill in your details to get started.
              </Description>
            </div>

            <Form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
              // onReset={handleReset}
            >
              <Fieldset className="w-full">
                <FieldGroup className="gap-5">
                  {/* Name */}
                  <TextField
                    name="name"
                    isRequired
                    validate={(value) => {
                      if (value.length < 3) {
                        return "Name must be at least 3 characters";
                      }

                      return null;
                    }}
                  >
                    <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <UserRound size={16} />
                      Full Name
                    </Label>

                    <Input
                      className={inputClass}
                      placeholder="Your Name"
                      autoComplete="name"
                    />

                    <FieldError />
                  </TextField>

                  {/* Email */}
                  <TextField
                    name="email"
                    type="email"
                    isRequire
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
                    minLength={8}
                    name="password"
                    type="password"
                    isRequired
                    onChange={setPassword}
                    validate={(value) => {
                      if (value.length < 8) {
                        return "Password must be at least 8 characters";
                      }

                      if (!/[A-Z]/.test(value)) {
                        return "Password must contain at least one uppercase letter";
                      }

                      if (!/[0-9]/.test(value)) {
                        return "Password must contain at least one number";
                      }

                      return null;
                    }}
                  >
                    <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <LockKeyhole size={16} />
                      Password
                    </Label>

                    <div className="relative w-full">
                      <Input
                        fullWidth
                        className={`${inputClass} w-full pr-12`}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white hover:
                        cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <Description>
                      Must be at least 8 characters with 1 uppercase and 1
                      number
                    </Description>

                    <FieldError />

                    {password && (
                      <div className="mt-3">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                strength >= level
                                  ? strength <= 2
                                    ? "bg-rose-400"
                                    : strength <= 3
                                      ? "bg-amber-400"
                                      : "bg-lime-400"
                                  : "bg-white/10"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="mt-2 text-xs text-slate-400">
                          Password strength:{" "}
                          <span className="text-slate-200">
                            {strength <= 2
                              ? "Weak"
                              : strength <= 3
                                ? "Medium"
                                : "Strong"}
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
                      value !== password ? "Passwords do not match." : null
                    }
                  >
                    <Label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                      <LockKeyhole size={16} />
                      Confirm Password
                    </Label>

                    <div className="relative w-full">
                      <Input
                        fullWidth
                        className={`${inputClass} w-full pr-12`}
                        type={showConfirmPassword ? "text" : "password"}
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
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white hover:
                        cursor-pointer"
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
                  isDisabled={loading || Boolean(socialLoading)}
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
                        Creating account...
                      </>
                    ) : (
                      <>
                        <span className="flex size-7 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-400/10 text-violet-300 transition-all duration-300 group-hover:border-violet-300/40 group-hover:bg-violet-400/20">
                          <UserPlus size={16} />
                        </span>

                        <span className="tracking-wide">Create Account</span>

                        <ArrowRight
                          size={17}
                          className="text-violet-300 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </Button>

                {/* <Button
                  type="reset"
                  variant="secondary"
                  isDisabled={loading || Boolean(socialLoading)}
                  aria-label="Reset form"
                  className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/3 px-5 font-semibold text-slate-300 transition-all duration-300 hover:border-violet-400/40 hover:bg-white/8 hover:text-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw
                    size={16}
                    className="transition-transform duration-500 group-hover:-rotate-180"
                  />
                  <span className="hidden sm:inline">Reset</span>
                </Button> */}

                <Button
                  type="reset"
                  variant="secondary"
                  isDisabled={loading || Boolean(socialLoading)}
                  aria-label="Reset form"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 font-semibold text-slate-300 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.25),6px_6px_16px_rgba(0,0,0,0.35),-4px_-4px_12px_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-violet-400/40 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.3),8px_8px_20px_rgba(0,0,0,0.4),-5px_-5px_14px_rgba(255,255,255,0.05),0_0_22px_rgba(139,92,246,0.15)] active:scale-[0.97] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.45),inset_-3px_-3px_8px_rgba(255,255,255,0.05)] disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social sign-up */}
            <div className="grid gap-3">
              <Button
                type="button"
                variant="secondary"
                isDisabled={loading || Boolean(socialLoading)}
                onPress={() => handleSocialSignUp("google")}
                className="w-full rounded-xl border border-white/10 bg-white/3 py-3 text-sm text-white transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
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
                isDisabled={loading || Boolean(socialLoading)}
                onPress={() => handleSocialSignUp("github")}
                className="w-full rounded-xl border border-white/10 bg-white/3 py-3 text-sm text-white transition hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
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

            <p className="mt-6 text-center text-xs leading-6 text-slate-400">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-violet-300 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-violet-300 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2.5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
            <span className="text-slate-400">Already have an account?</span>

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
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-8 border-t border-white/10 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} NextAuth Pro</p>
          <p>Built with ❤️ using Next.js, HeroUI & BetterAuth</p>

          <p className="group text-xs text-slate-500">
            Crafted with care by{" "}
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
      </footer>
    </main>
  );
}

/* const handleSocialSignUp = async (provider) => {
  setSocialLoading(provider);

  toast.promise(
    // 1. Return the promise so toast.promise can track its lifecycle
    authClient.signIn.social({
      provider,
      callbackURL: "/",
    })
    .then(({ error }) => {
      // 2. better-auth returns errors instead of throwing; throw manually to trigger the toast error state
      if (error) {
        throw new Error(error.message || `Unable to sign up with ${provider}.`);
      }
      
      // 3. Optional: If you need to route on success, do it here (e.g., router.push("/"))
      // router.push("/"); 
    })
    .finally(() => {
      // 4. Always reset the loading state whether it succeeds or fails
      setSocialLoading("");
    }),
    {
      loading: `Creating your account with ${provider}...`,
      success: "Successfully signed in!",
      
      error: {
        // 5. Dynamically extract and display the thrown error message
        render({ error }) {
          return error.message || "Social sign-up failed. Please try again.";
        }
      },
    }
  );
};
*/
