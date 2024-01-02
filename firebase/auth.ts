import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "./config";
import { APIResponse } from "@/utils/types";

export async function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email: string, password: string) {
  try {
    const login = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await login.user.getIdToken();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    if (response.ok && resBody.success) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logoutUser() {
  try {
    const response = await fetch("/api/auth/logout");
    console.log(response);
    const resBody = (await response.json()) as unknown as APIResponse<string>;
    console.log(resBody);
    if (response.ok && resBody.success) {
      await signOut(auth);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
