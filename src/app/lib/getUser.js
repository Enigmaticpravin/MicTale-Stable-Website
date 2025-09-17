import { cookies } from "next/headers";
import { adminAuth } from "@/app/lib/firebaseAdmin";

export async function getUser() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return null;
  }
}