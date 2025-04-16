import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Homework from "@/models/homework";
import Assignment from "@/models/assignment";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ err: "Not logged in" }, { status: 401 });

  await connectToDatabase();
  const body = await req.json();
  const { title, course, platform, due, submitted, url, catType } = body;

  let homework = await Homework.findOne({ title, course, platform });
  if (!homework) {
    homework = new Homework({
      users: [session.user._id],
      platform,
      course,
      title,
      due,
      url,
      ratingSum: 0,
      ratingNumber: 0,
      catType,
    });
    await homework.save();
  } else if (!homework.users.includes(session.user._id)) {
    homework.users.push(session.user._id);
    await homework.save();
  }

  const assignment = new Assignment({
    user_id: session.user._id,
    platform,
    course,
    title,
    due,
    submitted,
    url,
    create: Date.now() / 1000,
    rating: -1,
    catType,
    parent: homework._id,
  });

  await assignment.save();
  return NextResponse.json(assignment);
}