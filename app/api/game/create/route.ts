import { adminDb } from "@/firebase/adminConfig";
import { getServerAuth } from "@/firebase/serverAuth";
import { ALPHA_NUMERIC, GAME_ROOMS_COLLECTION } from "@/utils/constants";
import {
  CreateOrJoinRoomAPIResponse,
  GameRoomType,
  GameStatus
} from "@/utils/types";
import { serverTimestamp } from "firebase/database";
import { customAlphabet } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getServerAuth(request);
  if (!user) {
    return NextResponse.json<CreateOrJoinRoomAPIResponse>(
      {
        success: false,
        errorMsg: "You are not Authorized. Please Login"
      },
      { status: 401 }
    );
  }
  try {
    const reqBody = (await request.json()) as { userId: string };
    if (reqBody.userId !== user.uid) {
      return NextResponse.json<CreateOrJoinRoomAPIResponse>(
        {
          success: false,
          errorMsg: "Unable to Create Room. Please Try Again"
        },
        { status: 409 }
      );
    }
    const idGenerator = customAlphabet(ALPHA_NUMERIC, 6);
    const newRoomId = idGenerator();
    const newRoom: GameRoomType = {
      roomId: newRoomId,
      board: Array(9).fill(""),
      count: 0,
      gameStatus: GameStatus.NOT_STARTED,
      isRoomFull: false,
      users: [user.uid],
      timestamp: serverTimestamp()
    };
    const gameRoomRef = adminDb.ref(GAME_ROOMS_COLLECTION);
    const roomsRef = gameRoomRef.child(newRoomId);
    await roomsRef.set(newRoom);
    return NextResponse.json<CreateOrJoinRoomAPIResponse>(
      {
        success: true,
        roomId: newRoomId
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<CreateOrJoinRoomAPIResponse>(
      {
        success: false,
        errorMsg: "Unable to Create Room. Please Try Again Later"
      },
      { status: 500 }
    );
  }
}
