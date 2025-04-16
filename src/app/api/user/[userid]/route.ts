import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  await connectToDatabase();
  const user = await User.findById(params.userid);
  if (user) {
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { userid: string } }) {
  await connectToDatabase();
  const body = await req.json();
  const user = await User.findById(params.userid);
  if (user) {
    if (body.level) user.level = body.level;
    if (body.exp) user.exp = body.exp;
    if (body.name) user.name = body.name;
    await user.save();
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }
}