import { adminDb } from "@/firebase/adminConfig";
import { getServerAuth } from "@/firebase/serverAuth";
import { GAME_ROOMS_COLLECTION } from "@/utils/constants";
import {
  APIResponse,
  BoardType,
  GameRoomType,
  GameStatus,
  Move,
  SquareType
} from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getServerAuth(request);
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        errorMsg: "You are not Authorized. Please Login"
      },
      { status: 401 }
    );
  }
  try {
    const { roomId, idx } = (await request.json()) as Move;
    const gameRoomRef = adminDb.ref(`${GAME_ROOMS_COLLECTION}/${roomId}`);
    const gameRoom = await gameRoomRef.get();
    if (gameRoom.exists()) {
      const data = gameRoom.val() as GameRoomType;
      if (
        data.gameStatus === GameStatus.GAME_OVER_DRAW ||
        data.gameStatus === GameStatus.GAME_OVER_RESULT
      ) {
        return NextResponse.json<APIResponse>(
          {
            success: false,
            errorMsg: "Game Already Over. Can't make any Moves"
          },
          {
            status: 400
          }
        );
      }
      if (data.gameStatus === GameStatus.NOT_STARTED) {
        return NextResponse.json<APIResponse>(
          {
            success: false,
            errorMsg: "Game Not Started"
          },
          {
            status: 400
          }
        );
      }
      if (data.currentUser !== user.uid) {
        return NextResponse.json<APIResponse>(
          {
            success: false,
            errorMsg: "Opponent's Turn"
          },
          {
            status: 400
          }
        );
      }
      const squareValue = data.userX === data.currentUser ? "X" : "O";
      if (squareValue === "X") {
        data.currentUser = data.userO;
      } else {
        data.currentUser = data.userX;
      }
      data.board[idx] = squareValue;
      data.count = data.count + 1;
      const winnerSymbol = checkWinner(data.board);
      if (winnerSymbol !== "") {
        data.winnerSymbol = winnerSymbol;
        data.gameStatus = GameStatus.GAME_OVER_RESULT;
      } else if (data.count === 9) {
        data.winnerSymbol = winnerSymbol;
        data.gameStatus = GameStatus.GAME_OVER_DRAW;
      }
      console.log(data);
      await gameRoomRef.update(data, (error) => {
        if (error) {
          console.log("Error In Updating the Room");
        } else {
          console.log("Room Data Updated Successfully");
        }
      });
      return NextResponse.json<APIResponse<string>>(
        {
          success: true,
          data: "Move Made"
        },
        {
          status: 200
        }
      );
    } else {
      return NextResponse.json<APIResponse>(
        {
          success: false,
          errorMsg: "Room Does Not Exist"
        },
        {
          status: 404
        }
      );
    }
  } catch (error) {
    return NextResponse.json<APIResponse>(
      {
        success: false,
        errorMsg: "Unable to Make Move. Please Try Again"
      },
      { status: 500 }
    );
  }
}

function checkWinner(board: BoardType): SquareType {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i of winningCombinations) {
    const [a, b, c] = i;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return "";
}
