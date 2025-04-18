import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.json(session.user);
  } else {
    return NextResponse.json({});
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  await connectToDatabase();
  const body = await req.json();
  const user = await User.findById(userId);
  if (user) {
    if (body.current_badge) user.current_badge = body.current_badge;
    await user.save();
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }
}