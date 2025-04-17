import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HomeworkComment from "@/models/homework_comment";

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
    return NextResponse.json(newComment);
}