import getCurrentUser from "@/app/actions/getCurrentUser";
import db from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST (requset: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await requset.json();
    const { name,image } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized",{ status: 401 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error: any) {
    console.log(error,"SEETINGS_POST");
    return new NextResponse("Internal Error",{ status: 500 });
  }
}