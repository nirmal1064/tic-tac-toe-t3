import { cookies } from "next/headers";
import { adminAuth } from "./adminConfig";
import { SessionCookieOptions } from "firebase-admin/auth";
import { FIREBASE_SESSION } from "@/utils/constants";
import { NextRequest } from "next/server";

async function getSession() {
  try {
    return cookies().get(FIREBASE_SESSION)?.value;
  } catch (error) {
    return undefined;
  }
}

export async function getServerAuth(
  request: NextRequest | undefined = undefined
) {
  const cookies = request?.cookies;
  const session = cookies?.get(FIREBASE_SESSION)?.value;
  const _session = session || (await getSession());
  if (!_session) return null;
  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(_session);
    return await adminAuth.getUser(decodedIdToken.uid);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return adminAuth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await adminAuth.verifySessionCookie(session);
  return await adminAuth.revokeRefreshTokens(decodedIdToken.sub);
}
