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
  const { title, course, platform, due, submitted, url, cat_type } = body;

  let homework = await Homework.findOne({ title, course, platform });
  if (!homework) {
    console.log("Homework Not Found")
    homework = new Homework({
      users: [session.user._id],
      platform,
      course,
      title,
      due,
      url,
      rating_sum: 0,
      rating_num: 0,
      cat_type,
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
    create: Date.now(),
    cat_type,
    parent: homework._id,
  });

  await assignment.save();
  return NextResponse.json(assignment);
}