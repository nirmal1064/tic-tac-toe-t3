import RoomManager from "@/components/RoomManager";
import { getServerAuth } from "@/firebase/serverAuth";
import { redirect } from "next/navigation";

export default async function Room() {
  const user = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex justify-center items-center">
      <RoomManager />
    </main>
  );
}
