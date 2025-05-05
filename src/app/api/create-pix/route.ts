// src/app/api/create-pix/route.ts
import { NextRequest, NextResponse } from 'next/server';

// use require para que o TS não force só o tipo de configuração
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, description, email, first_name, last_name } = await req.json();
        const payment_data = {
            transaction_amount: amount,
            description,
            payment_method_id: 'pix',
            payer: { email, first_name, last_name },
        };
        const payment = await mercadopago.payment.create(payment_data);
        const qrBase64 = payment.body.point_of_interaction.transaction_data.qr_code_base64;
        return NextResponse.json({ qrBase64 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Erro ao criar Pix' }, { status: 500 });
    }
}
