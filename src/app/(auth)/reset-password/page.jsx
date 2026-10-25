import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset password",
  description: "Choose a new password for your account.",
  robots: { index: false, follow: false },
  referrer: "no-referrer", // keeps the token out of the Referer header
};

export default async function ResetPasswordPage({ searchParams }) {
  const { token, error } = await searchParams;

  return (
    <AuthShell>
      <ResetPasswordForm token={token} error={error} />
    </AuthShell>
  );
}
