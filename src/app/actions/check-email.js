"use server";

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
}
