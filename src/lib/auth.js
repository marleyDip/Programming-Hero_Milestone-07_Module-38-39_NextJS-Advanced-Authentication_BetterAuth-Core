import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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

  database: mongodbAdapter(db, {
    client,
  }),
});
