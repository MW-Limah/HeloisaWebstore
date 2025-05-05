// src/app/api/create-boleto/route.ts
import { NextRequest, NextResponse } from 'next/server';
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, description, email, first_name, last_name } = await req.json();
        const payment = await mercadopago.payment.create({
            transaction_amount: amount,
            description,
            payment_method_id: 'bolbradesco',
            payer: { email, first_name, last_name },
        });
        const boletoUrl = payment.body.transaction_details.external_resource_url;
        return NextResponse.json({ boletoUrl });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Erro ao criar boleto' }, { status: 500 });
    }
}
