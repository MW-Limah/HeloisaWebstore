import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    console.log('--- /api/create-pix chamada ---');
    console.log('Token carregado?', Boolean(process.env.MERCADO_PAGO_ACCESS_TOKEN));

    let bodyJson;
    try {
        bodyJson = await req.json();
        console.log('Payload recebido:', bodyJson);
    } catch (e) {
        console.error('❌ Falha ao ler JSON:', e);
        return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    try {
        const payment = new Payment(mpClient);
        const paymentResponse = await payment.create({
            body: {
                transaction_amount: bodyJson.amount,
                description: bodyJson.description,
                payment_method_id: 'pix',
                payer: {
                    email: bodyJson.email,
                    first_name: bodyJson.first_name,
                    last_name: bodyJson.last_name,
                },
            },
        });

        console.log('Resposta bruta do SDK:', paymentResponse);

        const qrBase64 =
            paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64 ??
            paymentResponse.point_of_interaction?.transaction_data?.qr_code;

        if (!qrBase64) {
            console.error('❌ QR code não encontrado na resposta:', paymentResponse);
            return NextResponse.json({ error: 'QR code não retornado pelo MP' }, { status: 502 });
        }

        console.log('✅ QR code gerado com sucesso');
        return NextResponse.json({ qrBase64 });
    } catch (err: any) {
        console.error('❌ Erro na criação do Pix:', err);
        // Se o SDK trouxer detalhes do erro HTTP, pode vir em err.response
        if (err.response) console.error('Detalhes do erro HTTP:', err.response);
        return NextResponse.json({ error: 'Erro ao criar Pix' }, { status: 500 });
    }
}
