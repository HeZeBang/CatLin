import { NextRequest, NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function POST(req: NextRequest) {
  try {
    // Sign out using NextAuth
    await signOut({ redirect: false });
    return NextResponse.json({});
  } catch (err) {
    console.error(`Failed to log out: ${err}`);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}