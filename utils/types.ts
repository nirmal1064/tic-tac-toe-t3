export type APIResponse<T = object> =
  | { success: true; data: T }
  | { success: false; errorMsg: string };

export enum GameStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  GAME_OVER_DRAW = "GAME_OVER_DRAW",
  GAME_OVER_RESULT = "GAME_OVER_RESULT"
}

export type SquareType = "X" | "O" | "";

export type BoardType = Array<SquareType>;

export type GameRoomType = {
  roomId: string;
  users: [string] | [string, string];
  userX?: string;
  userO?: string;
  isRoomFull: boolean;
  currentUser?: string;
  message?: string;
  board: BoardType;
  count: number;
  gameStatus: GameStatus;
  winnerSymbol?: SquareType;
  timestamp: object;
};

export type CreateOrJoinRoomAPIResponse =
  | { success: true; roomId: string }
  | { success: false; errorMsg: string };

export type Move = { roomId: string; idx: number };
