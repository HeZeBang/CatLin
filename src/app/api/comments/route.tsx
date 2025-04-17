import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SoftwareComment from "@/models/software_comment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const comments = await SoftwareComment.find({});
  return NextResponse.json(comments);
}


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ err: "Not logged in" }, { status: 401 });

  await connectToDatabase();
  const body = await req.json();
  const { content, rating } = body;

  const newComment = new SoftwareComment({
    creator_id: session.user._id,
    creator_name: session.user.name,
    content,
    rating,
    created_at: Date.now(),
  });

  await newComment.save();
  return NextResponse.json(newComment);
}