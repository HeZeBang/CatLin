import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { notFound, success, unauthorized } from "@/lib/response";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  await connectToDatabase();
  if (!session || !session.user) {
    return unauthorized();
  }
  const user = await User.findById(session.user._id);
  if (user) {
    return success(user, user);
  } else {
    return notFound();
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return unauthorized();
  }
  const userId = session.user._id;

  await connectToDatabase();
  const body = await req.json();
  const user = await User.findById(userId);
  if (user) {
    if (body.current_badge !== undefined)
      user.current_badge = body.current_badge;
    await user.save();
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }
}