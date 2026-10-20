import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,

    // requireEmailVerification: true,
    // sendResetPassword: async ({ user, url, token }, request) => {
    //   void resend.emails.send({
    //     from: "Acme <onboarding@resend.dev>",
    //     to: user.email,
    //     subject: "Reset your password",
    //     html: `
    //     <h4>Reset your password</h4>
    //     Click the link to reset your password: ${url}
    //     <p>Ignore this email if you haven't requested a password reset.</p>
    //     `,
    //   });
    // },
  },

  /* emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `
        <h1>Please Verify your email address</h1>
        Click <a href="${url}">here</a> to verify your email.
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 7 * 24 * 3600, // 7 days
  }, */

  user: {
    changeEmail: {
      enabled: true,
      // Called when a verified user asks to change email. Send the link to the user.
      // The callback name differs between Better Auth versions, so check the
      // "Change Email" section of the docs for yours.
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        // await sendEmail({ to: user.email, subject: "Confirm your new email", ... })
      },

      // Updating email immediately without verification
      // updateEmailWithoutVerification: true,
    },
  },

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

  database: mongodbAdapter(db, {
    client,
  }),
});
