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
        paymentMethod,
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
            payer: { email, first_name, last_name, identification },
        };

        if (paymentMethod === 'card') {
            paymentPayload.token = token;
            paymentPayload.issuer_id = issuer_id;
            paymentPayload.installments = installments;
        }

        const response = await payment.create({ body: paymentPayload });
        console.log('✅ Pagamento criado com sucesso:', response);

        // Extrai separadamente o QR code (texto) e o base64 (imagem)
        const txData = response.point_of_interaction?.transaction_data;
        const qrCode = txData?.qr_code ?? null; // Pix Copia-e-Cola
        const qrBase64 = txData?.qr_code_base64 ?? null; // imagem base64

        return NextResponse.json({
            paymentId: response.id,
            status: response.status,
            // Campos novos:
            qrCode,
            qrBase64,
            // se for boleto:
            boletoUrl: response.transaction_details?.external_resource_url ?? null,
        });
    } catch (err: any) {
        console.error('❌ Erro na criação do pagamento:', err);
        if (err.response) console.error('Detalhes do erro HTTP:', err.response);
        return NextResponse.json({ error: 'Erro ao criar pagamento, verifique seu email.' }, { status: 500 });
    }
}
