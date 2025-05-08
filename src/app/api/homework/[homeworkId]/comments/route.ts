import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import HomeworkComment from "@/models/homework_comment";
import Homework from "@/models/homework";

export async function GET(req: NextRequest, { params }: { params: Promise<{ homeworkId: string }> }) {
    const { homeworkId } = await params;
    await connectToDatabase();
    const comments = await HomeworkComment.find({ parent: homeworkId })
    return NextResponse.json(comments);
}


export async function POST(req: NextRequest, { params }: { params: Promise<{ homeworkId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ err: "Not logged in" }, { status: 401 });
    
    const { homeworkId } = await params;
    if (!homeworkId) return NextResponse.json({ err: "Missing homework id" }, { status: 400 });

    await connectToDatabase();
    const body = await req.json();
    const { creator_name, creator_badge, is_annonymous, content, rating } = body;

    const newComment = new HomeworkComment({
        creator_id: session.user._id,
        creator_name,
        creator_badge,
        content,
        rating,
        parent: homeworkId,
        create_at: Date.now(),
    });

    await newComment.save();

    const homework = await Homework.findById(homeworkId);
    if (!homework) return NextResponse.json({ err: "Homework not found" }, { status: 404 });

    homework.rating_num += 1;
    homework.rating_sum += rating;

    await homework.save();

    return NextResponse.json(newComment);
}