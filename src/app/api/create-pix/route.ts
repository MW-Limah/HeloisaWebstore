import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const dummyBase64 = 'exmaple';

    return NextResponse.json(dummyBase64);
}
