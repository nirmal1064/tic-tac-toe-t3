import GameMenu from "@/components/GameMenu";
import { getServerAuth } from "@/firebase/serverAuth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center flex flex-col gap-2 justify-center items-start">
        <p>Welcome {user?.email}</p>
        <p className="text-lg">Select a game mode:</p>
        <GameMenu isLoggedIn={!!user} />
      </div>
    </div>
  );
}
