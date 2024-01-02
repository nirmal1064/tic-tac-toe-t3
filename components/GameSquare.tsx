"use client";

import { useGame } from "@/context/GameProvider";
import { APIResponse, SquareType } from "@/utils/types";

type GameSquareProps = { value: SquareType; idx: number };

function GameSquare({ value, idx }: GameSquareProps) {
  const { roomId } = useGame();

  async function handleSquareClick() {
    console.log(`Clicked ${idx}`);
    const response = await fetch("/api/game/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, idx })
    });
    const responseBody = (await response.json()) as APIResponse<string>;
    console.log(responseBody);
    if (responseBody.success) {
      // Do Nothing as Board Component will handle the snapshot
    } else {
      console.log(responseBody.errorMsg);
      // TODO Display Error
    }
  }

  return (
    <div
      className="bg-gray-800 text-white hover:bg-gray-700 cursor-pointer w-[100px] h-[100px] flex justify-center items-center text-5xl"
      onClick={handleSquareClick}>
      {value}
    </div>
  );
}

export default GameSquare;
