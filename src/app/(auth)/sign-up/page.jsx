import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = {
  title: "Create Account",
  description:
    "Create your NextAuth Pro account with secure authentication powered by BetterAuth. Sign up using email, Google, or GitHub.",

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
