import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
    try {
        const { paymentId } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ success: false, message: 'paymentId é obrigatório' }, { status: 400 });
        }

        const payment = new Payment(mpClient);
        const result = await payment.cancel({ id: paymentId });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('❌ Erro ao cancelar pagamento:', error);
        return NextResponse.json({ success: false, message: 'Erro ao cancelar pagamento.' }, { status: 500 });
    }
}
