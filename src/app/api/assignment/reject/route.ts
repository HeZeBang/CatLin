import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import connectToDatabase from "@/lib/mongodb";
import Homework from "@/models/homework";
import Assignment from "@/models/assignment";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ err: "Not logged in" }, { status: 401 });

  await connectToDatabase();
  const body = await req.json();
  const { title, course, platform } = body;

  const homework = await Homework.findOne({ title, course, platform });
  if (homework) {
    const index = homework.users.indexOf(session.user._id);
    if (index !== -1) {
      homework.users.splice(index, 1);
      await homework.save();
    }

    const assignment = await Assignment.findOneAndDelete({
      user_id: session.user._id,
      platform,
      course,
      title,
    });

    if (assignment) {
      return NextResponse.json(assignment);
    } else {
      return NextResponse.json({ msg: "Assignment not found" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ msg: "Homework not found" }, { status: 404 });
  }
}