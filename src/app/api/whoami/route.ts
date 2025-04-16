import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.json(session.user);
  } else {
    return NextResponse.json({});
  }
}