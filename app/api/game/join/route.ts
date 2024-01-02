import { adminDb } from "@/firebase/adminConfig";
import { getServerAuth } from "@/firebase/serverAuth";
import { GAME_ROOMS_COLLECTION } from "@/utils/constants";
import {
  CreateOrJoinRoomAPIResponse,
  GameRoomType,
  GameStatus
} from "@/utils/types";
import { DataSnapshot } from "firebase-admin/database";
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
    const { roomId, userId } = (await request.json()) as {
      userId: string;
      roomId: string;
    };
    if (userId !== user.uid) {
      return NextResponse.json<CreateOrJoinRoomAPIResponse>(
        {
          success: false,
          errorMsg: "Unable to Join Room. Please Try Again"
        },
        { status: 409 }
      );
    }
    const gameRoomRef = adminDb.ref(`${GAME_ROOMS_COLLECTION}/${roomId}`);
    const gameRoom = await gameRoomRef.get();
    if (gameRoom.exists()) {
      const data = getUpdatedRoomData(gameRoom, userId);
      if (!data) {
        return NextResponse.json<CreateOrJoinRoomAPIResponse>(
          {
            success: true,
            roomId: gameRoom.key!
          },
          {
            status: 200
          }
        );
      }
      await gameRoomRef.update(data, (error) => {
        if (error) {
          console.log("Error In Updating the Room");
        } else {
          console.log("Room Data Updated Successfully");
        }
      });
      return NextResponse.json<CreateOrJoinRoomAPIResponse>(
        {
          success: true,
          roomId: gameRoom.key!
        },
        {
          status: 200
        }
      );
    } else {
      return NextResponse.json<CreateOrJoinRoomAPIResponse>(
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
    return NextResponse.json<CreateOrJoinRoomAPIResponse>(
      {
        success: false,
        errorMsg: "Unable to Join Room. Please Try Again Later"
      },
      { status: 500 }
    );
  }
}

function getUpdatedRoomData(gameRoom: DataSnapshot, userId: string) {
  const data = gameRoom.val() as GameRoomType;
  const users = data.users;
  if (users[0] === userId || userId[1] === userId) {
    return null;
  }
  const randomNum = Math.random();
  data.users.push(userId);
  if (randomNum < 0.5) {
    data.userX = data.users[0];
    data.userO = data.users[1];
  } else {
    data.userX = data.users[1];
    data.userO = data.users[0];
  }
  data.currentUser = data.userX;
  data.isRoomFull = true;
  data.gameStatus = GameStatus.IN_PROGRESS;
  return data;
}
