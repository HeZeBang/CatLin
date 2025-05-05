import { authOptions } from "@/lib/auth/authOptions";
import connectToDatabase from "@/lib/mongodb";
import { availableBadges } from "@/models/badges";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { gift_id } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user._id);
    
    return NextResponse.json({ msg: "Not found" }, { status: 404 });
}