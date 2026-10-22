import ProfileView from "@/components/profile/profile-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your profile",
  description: "Manage your name, email and password.",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  // Real validation (the proxy only checks the cookie exists)
  // if (!session) redirect("/sign-in");
  if (!session) redirect("/sign-in?reason=login-required&callbackURL=/profile");

  // Which sign-in methods this account has (credential = email + password)
  let providers = ["credential"];

  try {
    const accounts = await auth.api.listUserAccounts({ headers: h });
    providers = accounts.map((a) => a.providerId ?? a.provider);
  } catch {}

  const { user } = session;

  return (
    <ProfileView
      hasPassword={providers.includes("credential")}
      providers={providers}
      user={{
        name: user.name,
        email: user.email,
        image: user.image ?? null,
        emailVerified: Boolean(user.emailVerified),
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : null,
      }}
    />
  );
}
