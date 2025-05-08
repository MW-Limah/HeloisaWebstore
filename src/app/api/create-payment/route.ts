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
        paymentMethod, // 'pix', 'card', 'boleto'
        token, // necessário para cartão
        issuer_id, // opcional
        installments, // opcional
        identification, // { type: 'CPF', number: '...' } — necessário para boleto ou cartão
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

        // Tratamento específico para 'pix' e 'boleto'
        if (paymentMethod === 'pix') {
            // Para Pix, configurar conforme a necessidade
            const paymentResponse = await payment.create({ body: paymentPayload });
            const qrBase64 =
                paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64 ??
                paymentResponse.point_of_interaction?.transaction_data?.qr_code;

            if (!qrBase64) {
                console.error('❌ QR code não encontrado na resposta:', paymentResponse);
                return NextResponse.json({ error: 'QR code não retornado pelo MP' }, { status: 502 });
            }

            console.log('✅ QR code gerado com sucesso');
            return NextResponse.json({ qrBase64 });
        } else if (paymentMethod === 'bolbradesco') {
            // Para Boleto, configurar conforme a necessidade
            const paymentResponse = await payment.create({ body: paymentPayload });
            const boletoUrl = paymentResponse.transaction_details.external_resource_url;

            console.log('✅ Boleto criado com sucesso');
            return NextResponse.json({ boletoUrl });
        } else if (paymentMethod === 'card') {
            // Para Cartão de Crédito
            paymentPayload.token = token;
            paymentPayload.issuer_id = issuer_id;
            paymentPayload.installments = installments;

            const response = await payment.create({ body: paymentPayload });
            console.log('✅ Pagamento com cartão criado com sucesso:', response);

            return NextResponse.json({ payment: response });
        } else {
            return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 });
        }
    } catch (err: any) {
        console.error('❌ Erro na criação do pagamento:', err);
        if (err.response) console.error('Detalhes do erro HTTP:', err.response);
        return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
    }
}
