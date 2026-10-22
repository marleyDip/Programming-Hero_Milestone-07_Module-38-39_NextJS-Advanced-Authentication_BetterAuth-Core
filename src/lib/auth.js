import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

import {
  sendChangeEmailConfirmation,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "@/lib/email";

/* Reuse one Mongo client across hot reloads in development */
const globalForMongo = globalThis;
const client =
  globalForMongo._mongoClient ??
  (globalForMongo._mongoClient = new MongoClient(
    process.env.BETTER_AUTH_DB_URL,
  ));

const db = client.db("better-auth-db");

export const auth = betterAuth({
  appName: "NextAuth Pro",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, { client }),

  /* ---------- Email & password ---------- */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour

    // `void` = don't await, so response time can't reveal whether an account exists
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({ user, url });
    },
  },

  /* ---------- Email verification ---------- */
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 7 * 24 * 60 * 60, // 7 days

    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({ user, url });
    },
  },

  /* ---------- Account changes ---------- */
  user: {
    changeEmail: {
      enabled: true,

      // Sent to the CURRENT address so a hijacked session can't silently swap the email.
      // In newer Better Auth versions this option is named `sendChangeEmailConfirmation`.
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        void sendChangeEmailConfirmation({ user, newEmail, url });
      },
    },
  },

  /* ---------- Social login ---------- */
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
    },
  },

  /* Same email via Google and GitHub links to one account instead of failing */
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  /* ---------- Sessions ---------- */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // fewer DB reads
  },
});
