import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function success<T>(data: T, user?: any, message: string = 'Success', status: number = 200) {
    // TODO: zod validation user
    const session = await getServerSession();
    return NextResponse.json({ msg: message, data, user: user || session?.user }, { status });
}

export async function error(message: string, status: number = 500) {
    return NextResponse.json({ msg: message }, { status });
}

export async function notFound(message: string = 'Not Found', status: number = 404) {
    return NextResponse.json({ msg: message }, { status });
}

export async function unauthorized(message: string = 'Unauthorized', status: number = 401) {
    return NextResponse.json({ msg: message }, { status });
}