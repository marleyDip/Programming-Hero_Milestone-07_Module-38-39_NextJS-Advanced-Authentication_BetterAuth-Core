import SignInForm from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account securely with email, Google or GitHub.",
  alternates: { canonical: "/sign-in" },
  // Auth pages have no search value. Change to index: true if you want it ranked.
  robots: { index: false, follow: true },
};

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");

  return <SignInForm />;
}
