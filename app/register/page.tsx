"use client";
import { registerUser } from "@/firebase/auth";
import Link from "next/link";
import { FormEvent } from "react";

export default function Register() {
  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const registeredUser = await registerUser(email, password);
    console.log(registeredUser);
    e.currentTarget.reset();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 w-full border rounded bg-gray-700 placeholder-gray-400 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 w-full border rounded bg-gray-700 placeholder-gray-400 text-gray-200"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="mt-1 p-2 w-full border rounded bg-gray-700 placeholder-gray-400 text-gray-200"
              required
            />
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-white">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
