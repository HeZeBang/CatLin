import { authOptions } from "@/lib/auth/authOptions";
import connectToDatabase from "@/lib/mongodb";
import { availableBadges } from "@/models/badges";
import Homework from "@/models/homework";
import User, { UserType } from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { task_id } = await req.json();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user._id);
    if (availableBadges.map(badge => badge.task_id).includes(task_id)) {
        const badge = availableBadges.find(badge => badge.task_id === task_id);
        if (badge && user && !user.badges.includes(availableBadges.indexOf(badge))) {
            user.badges.push(availableBadges.indexOf(badge));
            await user.save();
        }
        return NextResponse.json({
            msg: "Success", data: user
        });
    }
    return NextResponse.json({ msg: "Not found" }, { status: 404 });
}