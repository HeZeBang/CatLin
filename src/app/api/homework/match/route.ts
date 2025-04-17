import connectToDatabase from "@/lib/mongodb";
import Homework from "@/models/homework";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { platform, course, title, due } = await req.json();
    
    await connectToDatabase();
    const homework = await Homework.find({ platform, course, title, due });
    if (homework.length > 0) {
        return NextResponse.json(homework);
    } else {
        return NextResponse.json({ msg: "No matching homework found" }, { status: 404 });
    }
}