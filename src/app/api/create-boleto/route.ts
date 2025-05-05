// /app/api/create-boleto/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // Simulação: gerar URL do boleto
    const boletoUrl = 'https://exemplo.com/boleto123.pdf';

    return NextResponse.json({ boleto_url: boletoUrl });
}
