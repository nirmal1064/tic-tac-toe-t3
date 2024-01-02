"use client";
import { useRouter } from "next/navigation";
import GameButton from "./GameButton";
import LogoutButton from "./LogoutButton";

type Props = { isLoggedIn: boolean };

export default function GameMenu({ isLoggedIn }: Props) {
  const router = useRouter();

  function handleNewGameVsComputer() {
    console.log("New Game vs Computer");
  }

  function handlePvPMultiplayer() {
    router.push("/room");
  }

  function handlePassNPlay() {
    router.push("/game");
  }

  return (
    <div className="flex flex-col items-center space-y-4 mt-4">
      <GameButton label="Play vs Computer" onClick={handleNewGameVsComputer} />
      {isLoggedIn && (
        <GameButton label="PvP Multiplayer" onClick={handlePvPMultiplayer} />
      )}
      <GameButton label="Pass 'n' Play" onClick={handlePassNPlay} />
      {isLoggedIn && <LogoutButton />}
    </div>
  );
}
