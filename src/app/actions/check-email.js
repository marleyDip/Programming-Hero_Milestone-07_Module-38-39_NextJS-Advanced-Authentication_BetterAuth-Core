"use server";

import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (email) =>
  String(email ?? "")
    .trim()
    .toLowerCase();

// Private helper (not exported, so it is never exposed as an action)
async function findByEmail(value) {
  if (!EMAIL_RE.test(value)) return false;

  const user = await db
    .collection("user")
    .findOne({ email: value }, { projection: { _id: 1 } });

  return Boolean(user);
}

/* Open: for the sign-up page (visitors have no session yet) */
export async function emailExists(email) {
  return findByEmail(normalize(email));
}

/* Session-only: for the profile page */
export async function emailTakenByAnotherUser(email) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const value = normalize(email);

  // Typing your own current email is not "taken by another user"
  if (value === session.user.email.toLowerCase()) return false;

  return findByEmail(value);
}

/* "use server";

import { db } from "@/lib/auth";

export async function emailExists(email) {
  const value = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;

  // Better Auth's default collection name is "user"
  const user = await db
    .collection("user")
    .findOne({ email: value }, { projection: { _id: 1 } });

  return Boolean(user);
} */
