// src/app/api/create-boleto/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, description, email, first_name, last_name } = await req.json();
        const payment = new Payment(mpClient);
        const paymentResponse = await payment.create({
            body: {
                transaction_amount: amount,
                description,
                payment_method_id: 'bolbradesco',
                payer: { email, first_name, last_name },
            },
        });

        const boletoUrl = paymentResponse.transaction_details.external_resource_url;

        return NextResponse.json({ boletoUrl });
    } catch (err: any) {
        console.error('Erro ao criar boleto:', err);
        return NextResponse.json({ error: 'Erro ao criar boleto' }, { status: 500 });
    }
}
