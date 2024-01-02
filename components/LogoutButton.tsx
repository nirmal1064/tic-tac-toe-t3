"use client";
import { logoutUser } from "@/firebase/auth";

export default function LogoutButton() {
  async function handleLogout() {
    await logoutUser();
  }

  return (
    <div onClick={handleLogout}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-8 w-8 cursor-pointer">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 3a8 8 0 100 16 8 8 0 000-16zM16 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
}
