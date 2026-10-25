"use client";

import { resetPassword } from "@/lib/auth-client";
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
  ArrowRight,
  CircleCheck,
  Eye,
  EyeOff,
  KeyRound,
  LinkIcon,
  LoaderCircle,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";

import Link from "next/link";
// import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/4 pl-11 pr-12 text-white placeholder:text-slate-500 transition focus-within:border-lime-300/60 focus-within:bg-white/6 focus-within:ring-4 focus-within:ring-lime-300/10";

const getStrength = (v) =>
  [
    v.length >= 8,
    /[A-Z]/.test(v),
    /[a-z]/.test(v),
    /[0-9]/.test(v),
    /[^A-Za-z0-9]/.test(v),
  ].filter(Boolean).length;

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

export default function ResetPasswordForm({ token, error }) {
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Only the new password needs state (strength meter + confirm check)
  const [password, setPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(password);
  const strengthLabel =
    strength <= 2 ? "Weak" : strength <= 3 ? "Medium" : "Strong";
  const strengthColor =
    strength <= 2
      ? "bg-rose-400"
      : strength <= 3
        ? "bg-amber-400"
        : "bg-lime-300";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    // const userData = Object.fromEntries(formData.entries());

    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both fields are identical.",
      });
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Updating your password...");

    try {
      // const { error: resetError } = await authClient.resetPassword({

      const { error: resetError } = await resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (resetError) {
        toast.error("Reset failed", {
          id: toastId,
          description:
            resetError.message ||
            "This link may have expired. Request a new one.",
        });
        return;
      }

      toast.success("Password updated", {
        id: toastId,
        description: "You can now sign in with your new password.",
      });

      setDone(true);
    } catch {
      toast.error("Something went wrong", {
        id: toastId,
        description: "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Invalid / expired / missing link ---------- */
  if (!token || error) {
    return (
      <div className="rise-in text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-amber-300/25 bg-amber-300/10 text-amber-200">
          <ShieldAlert size={28} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Link expired</h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {error === "INVALID_TOKEN"
            ? "This reset link is invalid, has expired, or was already used."
            : "This page needs a valid reset link from your email."}{" "}
          Request a new one and we'll send it right away.
        </p>

        <Link
          href="/forgot-password"
          className="group relative mt-7 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)]"
        >
          <LinkIcon size={17} />
          Request a new link
        </Link>
      </div>
    );
  }

  /* ---------- Success ---------- */
  if (done) {
    return (
      <div className="rise-in text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-lime-300/25 bg-lime-300/10 text-lime-200">
          <CircleCheck size={28} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Password{" "}
          <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
            updated
          </span>
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Your password has been changed. Sign in with the new one to continue.
        </p>

        <Link
          href="/sign-in"
          className="group relative mt-7 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-lime-300 via-lime-200 to-emerald-300 font-semibold text-[#0b0c0e] shadow-[0_8px_30px_rgba(190,242,100,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(190,242,100,0.4)]"
        >
          Continue to sign in
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    );
  }

  /* ---------- New password form ---------- */
  return (
    <div className="rise-in">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/10 bg-linear-to-br from-lime-300/20 to-violet-500/20 text-lime-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <KeyRound size={28} />
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Set a new{" "}
          <span className="bg-linear-to-r from-lime-300 via-emerald-200 to-cyan-300 bg-clip-text text-transparent">
            password
          </span>
        </h1>

        <Description className="mt-2 text-sm leading-6 text-slate-400">
          Choose a strong password you don't use anywhere else.
        </Description>
      </div>

      <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField
          name="newPassword"
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
            New password
          </Label>

          <div className="relative w-full">
            <LockKeyhole
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            />

            <Input
              fullWidth
              className={inputClass}
              type={showNew ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />

            <RevealButton
              shown={showNew}
              onToggle={() => setShowNew((s) => !s)}
            />
          </div>

          <Description className="mt-2 text-xs text-slate-500">
            At least 8 characters with 1 uppercase and 1 number
          </Description>

          <FieldError />

          {password && (
            <div className="mt-3">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      strength >= level ? strengthColor : "bg-white/10"
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

        <TextField
          name="confirmPassword"
          isRequired
          validate={(value) =>
            value !== password ? "Passwords do not match." : null
          }
        >
          <Label className="mb-2 block text-sm font-medium text-slate-300">
            Confirm new password
          </Label>

          <div className="relative w-full">
            <LockKeyhole
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            />

            <Input
              fullWidth
              className={inputClass}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />

            <RevealButton
              shown={showConfirm}
              onToggle={() => setShowConfirm((s) => !s)}
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
                Updating...
              </>
            ) : (
              <>
                Reset password
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </span>
        </Button>
      </Form>
    </div>
  );
}

/* http://localhost:3000/api/auth/reset-password/Ul8V8XrP6UOGIqBpK0cnJc7t?callbackURL=%2Freset-password

That's the link Better Auth puts in the reset email, and its format is correct. callbackURL=%2Freset-password is the redirectTo: "/reset-password"

Expected behavior -

  1. Better Auth checks the token at /api/auth/reset-password/<token>.
  
  2. If it's valid, it redirects to http://localhost:3000/reset-password?token=<token> and your new-password form appears.
  
  3. If it's invalid, it redirects to /reset-password?error=INVALID_TOKEN and the "Link expired" screen appears.

*/
