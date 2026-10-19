import SignInForm from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account securely with email, Google or GitHub.",
  alternates: { canonical: "/sign-in" },
  // Auth pages have no search value. Change to index: true if you want it ranked.
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return <SignInForm />;
}
