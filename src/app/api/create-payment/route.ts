import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    console.log('--- /api/create-payment chamada ---');

    let bodyJson;
    try {
        bodyJson = await req.json();
        console.log('Payload recebido:', bodyJson);
    } catch (e) {
        console.error('❌ Falha ao ler JSON:', e);
        return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    const {
        amount,
        description,
        email,
        first_name,
        last_name,
        paymentMethod, // 'pix', 'card', etc.
        token,
        issuer_id,
        installments,
        identification,
    } = bodyJson;

    try {
        const payment = new Payment(mpClient);

        const paymentPayload: any = {
            transaction_amount: amount,
            description,
            payment_method_id: paymentMethod,
            payer: {
                email,
                first_name,
                last_name,
                identification,
            },
        };

        if (paymentMethod === 'card') {
            paymentPayload.token = token;
            paymentPayload.issuer_id = issuer_id;
            paymentPayload.installments = installments;
        }

        const response = await payment.create({ body: paymentPayload });

        console.log('✅ Pagamento criado com sucesso:', response);

        const qrBase64 =
            response.point_of_interaction?.transaction_data?.qr_code_base64 ??
            response.point_of_interaction?.transaction_data?.qr_code ??
            null;

        return NextResponse.json({
            paymentId: response.id,
            qrBase64,
            status: response.status,
        });
    } catch (err: any) {
        console.error('❌ Erro na criação do pagamento:', err);
        if (err.response) console.error('Detalhes do erro HTTP:', err.response);
        return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
    }
}
