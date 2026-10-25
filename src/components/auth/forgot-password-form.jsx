"use client";

import { requestPasswordReset } from "@/lib/auth-client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  LoaderCircle,
  Mail,
  MailCheck,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/4 pl-11 text-white placeholder:text-slate-500 transition focus-within:border-lime-300/60 focus-within:bg-white/6 focus-within:ring-4 focus-within:ring-lime-300/10";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const COOLDOWN = 60;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendLink = async (email) => {
    setLoading(true);

    const toastId = toast.loading("Sending reset link...", {
      description: "This will only take a moment.",
    });

    try {
      // On older Better Auth versions this method is called `forgetPassword`
      // const { error } = await authClient.requestPasswordReset({

      const { error } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error("Couldn't send the link", {
          id: toastId,
          description: error.message || "Please try again.",
        });
        return;
      }

      // Same message whether or not the account exists, so emails can't be probed
      toast.success("Request received", {
        id: toastId,
        description: "If that email has an account, a link is on its way.",
      });
      setSentTo(email);
      setCooldown(COOLDOWN);
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    // const userData = Object.fromEntries(formData.entries());

    // console.log("user data before submit", userData);

    const { email } = Object.fromEntries(new FormData(e.currentTarget));

    sendLink(String(email).trim().toLowerCase());
  };

  /* ---------- Success view ---------- */
  if (sentTo) {
    return (
      <div className="rise-in text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-lime-300/25 bg-lime-300/10 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <MailCheck size={28} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Check your{" "}
          <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
            inbox
          </span>
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          If an account exists for{" "}
          <span className="font-semibold text-slate-200">{sentTo}</span>, we
          sent a link to reset your password. It expires in 1 hour.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-4 text-left text-xs leading-5 text-slate-400">
          Nothing arrived? Check your spam folder, and make sure you used the
          email you signed up with.
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            variant="secondary"
            isDisabled={cooldown > 0 || loading}
            onPress={() => sendLink(sentTo)}
            className="h-12 rounded-2xl border border-white/10 bg-white/4 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
          </Button>

          <button
            type="button"
            onClick={() => setSentTo("")}
            className="cursor-pointer text-sm text-slate-400 transition hover:text-white"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Request view ---------- */
  return (
    <div className="rise-in">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-lime-300/20 to-violet-500/20 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <KeyRound size={28} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Forgot your{" "}
          <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
            password?
          </span>
        </h1>

        <Description className="mt-2 text-sm leading-6 text-slate-400">
          No problem. Enter your email and we'll send you a secure link to
          choose a new one.
        </Description>
      </div>

      <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          name="email"
          type="email"
          isRequired
          validate={(value) =>
            emailRegex.test(value) ? null : "Please enter a valid email address"
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

        <Button
          type="submit"
          isDisabled={loading}
          className="group relative h-12 w-full overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2">
            {loading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                Send reset link
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
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 rounded-md font-semibold text-white underline decoration-lime-300/50 underline-offset-4 transition hover:decoration-lime-300"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
