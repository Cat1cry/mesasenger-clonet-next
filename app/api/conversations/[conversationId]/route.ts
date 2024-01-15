import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function DELETE (
  req: Request,
  { params }: { params: IParams; }
) {
  try {

    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized",{ status: 401 });
    }

    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID",{ status: 400 });
    }

    await db.message.deleteMany({
      where: {
        conversationId: conversationId,
      },
    });

    const deleteConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [ currentUser.id ]
        }
      }
    });

    existingConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email,"conversation:remove",existingConversation);
      }
    });

    return NextResponse.json(deleteConversation);

  } catch (error: any) {
    console.log(error,"ERROR_CONVERSATION_DELETE");
    return new NextResponse("Internal Error",{ status: 500 });
  }
}