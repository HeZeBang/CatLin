import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Homework from "@/models/homework";

export async function GET(req: NextRequest, { params }: { params: { homeworkid: string } }) {
  await connectToDatabase();
  const homework = await Homework.findById(params.homeworkid);
  if (homework) {
    return NextResponse.json(homework);
  } else {
    return NextResponse.json({ msg: "Homework not found" }, { status: 404 });
  }
}