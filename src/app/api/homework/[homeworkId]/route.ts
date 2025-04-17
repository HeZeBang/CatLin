import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Homework from "@/models/homework";

export async function GET(req: NextRequest, { params }: { params: Promise<{ homeworkId: string }> }) {
  const { homeworkId } = await params;
  await connectToDatabase();
  const homework = await Homework.findById(homeworkId);
  if (homework) {
    return NextResponse.json(homework);
  } else {
    return NextResponse.json({ msg: `Homework ${homeworkId} not found` }, { status: 404 });
  }
}