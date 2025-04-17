import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import { signIn } from "next-auth/react";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json(); // Expecting the Google ID token from frontend

    // Verify the Google ID token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json({ err: "Invalid token" }, { status: 401 });
    }

    // Connect to database and find or create user
    await connectToDatabase();
    let user = await User.findOne({ googleid: payload.sub });
    if (!user) { // FIXME: This should be a separate function
      user = new User({
        name: payload.name,
        googleid: payload.sub,
        level: 1,
        exp: 0,
      });
      await user.save();
    }

    return NextResponse.json(user.toObject());
  } catch (err) {
    console.error(`Failed to log in: ${err}`);
    return NextResponse.json({ err: err.message }, { status: 401 });
  }
}