"use client";
import { useAuth } from "@/context/FirebaseAuthProvider";
import { useGame } from "@/context/GameProvider";
import { db } from "@/firebase/config";
import { GAME_ROOMS_COLLECTION } from "@/utils/constants";
import { GameRoomType, GameStatus } from "@/utils/types";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GameSquare from "./GameSquare";

export default function Board() {
  const { roomId, message, game, setGame } = useGame();
  const router = useRouter();

  if (!roomId) {
    router.push("/room");
  }

  useEffect(() => {
    const gameRef = ref(db, `${GAME_ROOMS_COLLECTION}/${roomId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const gameDoc = snapshot.val() as GameRoomType;
        console.log(gameDoc);
        setGame(gameDoc);
      }
    });
    return unsubscribe;
  }, [roomId, setGame]);

  return (
    <div className="flex flex-col gap-2">
      <h1>Room ID {roomId}</h1>
      <p>{message}</p>
      <GameInfo />
      <div className="grid grid-cols-3 gap-2.5">
        {game?.board.map((value, idx) => (
          <GameSquare key={idx} value={value} idx={idx} />
        ))}
      </div>
    </div>
  );
}

function GameInfo() {
  const { game } = useGame();
  const { user } = useAuth();
  let message = "";

  if (game?.gameStatus === GameStatus.GAME_OVER_RESULT) {
    if (game.userX === user?.uid && game.winnerSymbol === "X") {
      message = "You Won The Game";
    } else if (game.userO === user?.uid && game.winnerSymbol === "O") {
      message = "You Won The Game";
    } else {
      message = "Opponent Won the Game";
    }
  } else if (game?.gameStatus === GameStatus.GAME_OVER_DRAW) {
    message = "Game Drawn";
  } else if (game?.gameStatus === GameStatus.IN_PROGRESS) {
    if (game.userX === user?.uid) {
      message = "You Play X";
    } else if (game.userO === user?.uid) {
      message = "You Play O";
    }
  } else {
    message = "Waiting For Opponent";
  }

  return <p>{message}</p>;
}
