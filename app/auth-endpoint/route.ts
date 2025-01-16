import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/Liveblocks";
import { NextResponse } from "@/node_modules/next/server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth(); // Authenticate the user

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionClaims } = await auth();
    const { room } = await req.json();

    const session = liveblocks.prepareSession(sessionClaims?.email, {
      userInfo: {
        name: sessionClaims?.fullName!,
        email: sessionClaims?.email!,
        avatar: sessionClaims?.image!,
      },
    });

    const usersInRoom = await adminDb
      .collectionGroup("rooms")
      .where("userId", "==", sessionClaims?.email!)
      .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
      console.log("you are authrizd");
      return new Response(body, { status });
    } else {
      return NextResponse.json(
        { message: "You are not in this room" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Authentication failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
