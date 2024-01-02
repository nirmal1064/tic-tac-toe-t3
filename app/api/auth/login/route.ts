import { createSessionCookie } from "@/firebase/serverAuth";
import { FIREBASE_SESSION } from "@/utils/constants";
import { APIResponse } from "@/utils/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as { idToken: string };
    const idToken = reqBody.idToken;
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
    const sessionCookie = await createSessionCookie(idToken, { expiresIn });
    cookies().set(FIREBASE_SESSION, sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true
    });
    return NextResponse.json<APIResponse<string>>({
      success: true,
      data: "Logged In Successfully."
    });
  } catch (error) {
    return NextResponse.json<APIResponse<string>>({
      success: false,
      errorMsg: "Error occured in Login"
    });
  }
}
