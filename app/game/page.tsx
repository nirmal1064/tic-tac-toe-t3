import Board from "@/components/Board";
import { getServerAuth } from "@/firebase/serverAuth";
import { redirect } from "next/navigation";

export default async function Game() {
  const user = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Board />
    </div>
  );
}
