import SignUpForm from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create Account",
  description:
    "Create your account in seconds with email, Google or GitHub. Create your NextAuth Pro account with secure authentication powered by BetterAuth. Sign up using email, Google, or GitHub.",

  alternates: { canonical: "/sign-up" },

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Create Account | NextAuth Pro",
    description:
      "Get started with NextAuth Pro for secure, seamless authentication and user management.",
    type: "website",
  },
};

export default function SignUpPage() {
  return <SignUpForm />;
}
