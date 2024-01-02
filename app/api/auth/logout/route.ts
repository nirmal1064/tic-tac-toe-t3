import { revokeAllSessions } from "@/firebase/serverAuth";
import { FIREBASE_SESSION } from "@/utils/constants";
import { APIResponse } from "@/utils/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(FIREBASE_SESSION)?.value;
  if (!sessionCookie)
    return NextResponse.json<APIResponse<string>>(
      { success: false, errorMsg: "Session not found." },
      { status: 400 }
    );
  cookieStore.delete(FIREBASE_SESSION);
  await revokeAllSessions(sessionCookie);
  return NextResponse.json<APIResponse<string>>({
    success: true,
    data: "Logged out successfully."
  });
}
