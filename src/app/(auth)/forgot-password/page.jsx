import AuthShell from "@/components/auth/auth-shell";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot password",
  description: "Request a secure link to reset your password.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
