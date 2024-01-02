"use client";
import { useAuth } from "@/context/FirebaseAuthProvider";
import { useGame } from "@/context/GameProvider";
import { db } from "@/firebase/config";
import { ALPHA_NUMERIC, GAME_ROOMS_COLLECTION } from "@/utils/constants";
import {
  GameRoomType,
  GameStatus,
  CreateOrJoinRoomAPIResponse
} from "@/utils/types";
import { push, ref, serverTimestamp } from "firebase/database";
import { customAlphabet } from "nanoid";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function RoomManager() {
  const { user } = useAuth();
  const { setRoomId } = useGame();
  const router = useRouter();

  // async function handleCreateRoom() {
  //   const gameRoomRef = ref(db, GAME_ROOMS_COLLECTION);
  //   const idGenerator = customAlphabet(ALPHA_NUMERIC, 6);
  //   const newRoomId = idGenerator();

  //   const newRoom: GameRoomType = {
  //     roomId: newRoomId,
  //     board: Array(9).fill(""),
  //     count: 0,
  //     currentUser: null,
  //     gameStatus: GameStatus.NOT_STARTED,
  //     isRoomFull: false,
  //     users: [user?.uid!],
  //     timestamp: serverTimestamp()
  //   };
  //   const newRoomRef = push(gameRoomRef, newRoom);
  //   setRoomId(newRoomRef.key);
  //   router.push("/game");
  // }

  async function handleCreateRoom() {
    const response = await fetch("/api/game/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.uid })
    });
    const responseBody = (await response.json()) as CreateOrJoinRoomAPIResponse;
    if (response.ok && responseBody.success) {
      setRoomId(responseBody.roomId);
      router.push("/game");
    } else {
      // TODO Display Error Message
    }
  }

  async function handleJoinRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const roomId = form.get("roomId") as string;
    const response = await fetch("/api/game/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.uid, roomId })
    });
    const responseBody = (await response.json()) as CreateOrJoinRoomAPIResponse;
    if (response.ok && responseBody.success) {
      setRoomId(responseBody.roomId);
      router.push("/game");
    } else {
      // TODO Display Error Message
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-64 transition duration-300 ease-in-out"
        onClick={handleCreateRoom}>
        Create New Room
      </button>
      <p className="text-center">----------------or----------------</p>
      <form onSubmit={handleJoinRoom} className="flex flex-col gap-2">
        <input
          type="text"
          name="roomId"
          className="mt-1 p-2 w-full border rounded bg-gray-700 text-gray-200"
          placeholder="Enter Room ID"
          required
        />
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-64 transition duration-300 ease-in-out">
          Join Room
        </button>
      </form>
    </div>
  );
}
