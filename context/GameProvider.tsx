"use client";
import { BoardType, GameRoomType, SquareType } from "@/utils/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";

type GameProviderType = { children: React.ReactNode };

type GameContextType = {
  roomId: string | null;
  setRoomId: Dispatch<SetStateAction<string | null>>;
  board: BoardType;
  setBoard: Dispatch<SetStateAction<BoardType>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  game: GameRoomType | null;
  setGame: Dispatch<SetStateAction<GameRoomType | null>>;
  clearBoard: () => void;
};

const GameContext = createContext({} as GameContextType);
export const useGame = () => useContext(GameContext);
const defaultBoard = Array<SquareType>(9).fill("");

export default function GameProvider({ children }: GameProviderType) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [board, setBoard] = useState(defaultBoard);
  const [message, setMessage] = useState("");
  const [game, setGame] = useState<GameRoomType | null>(null);

  function clearBoard() {
    setRoomId(null);
    setBoard(defaultBoard);
    setMessage("");
    setGame(null);
  }

  return (
    <GameContext.Provider
      value={{
        roomId,
        setRoomId,
        board,
        setBoard,
        message,
        setMessage,
        game,
        setGame,
        clearBoard
      }}>
      {children}
    </GameContext.Provider>
  );
}
