// src/app/(auth)/sign-in/page.jsx  (no "use client" here)
import SignInForm from "@/components/auth/sign-in-form";
import { auth } from "@/lib/auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { headers } from "next/headers";
import { redirect } from "next/navigation"; // only redirect, no useSearchParams

export const metadata = {
  title: "Sign in",
  description: "Sign in to your account securely with email, Google or GitHub.",
  alternates: { canonical: "/sign-in" },
  robots: { index: false, follow: true },
};

export default async function SignInPage({ searchParams }) {
  const { reason, callbackURL } = await searchParams;
  const redirectTo = safeRedirect(callbackURL);

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(redirectTo);

  return <SignInForm reason={reason} callbackURL={redirectTo} />;
}

// import SignInForm from "@/components/auth/sign-in-form";
// import { auth } from "@/lib/auth";
// import { safeRedirect } from "@/lib/safe-redirect";
// import { headers } from "next/headers";
// import { redirect, useSearchParams } from "next/navigation";

// export const metadata = {
//   title: "Sign in",
//   description: "Sign in to your account securely with email, Google or GitHub.",
//   alternates: { canonical: "/sign-in" },
//   // Auth pages have no search value. Change to index: true if you want it ranked.
//   robots: { index: false, follow: true },
// };

// export default async function SignInPage() {
//   // const session = await auth.api.getSession({ headers: await headers() });
//   // if (session) redirect("/");

//   // const { reason, callbackURL } = await searchParams;

//   const searchParams = useSearchParams();
//   const reason = searchParams.get("reason");
//   const redirectTo = safeRedirect(callbackURL);

//   const session = await auth.api.getSession({ headers: await headers() });
//   if (session) redirect(redirectTo);

//   return <SignInForm reason={reason} callbackURL={redirectTo} />;
// }
