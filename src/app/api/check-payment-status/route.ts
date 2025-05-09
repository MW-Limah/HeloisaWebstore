import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (Array.isArray(transactionId)) {
        // Caso seja um array, use o primeiro valor (ou lide com isso como preferir)
        console.error('transactionId is an array:', transactionId);
        return NextResponse.json({ status: 'error', message: 'Invalid transactionId' });
    }

    if (!transactionId) {
        return NextResponse.json({ status: 'error', message: 'transactionId is required' });
    }

    // Aqui, agora temos um valor de 'transactionId' garantidamente do tipo 'string'
    try {
        // Aqui você pode fazer a lógica para verificar o status do pagamento
        const paymentStatus = await checkPaymentStatus(transactionId);

        if (paymentStatus === 'paid') {
            return NextResponse.json({ status: 'paid' });
        } else {
            return NextResponse.json({ status: 'pending' });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 'error', message: 'Failed to check payment status' });
    }
}

// Exemplo de função para simular a verificação do status do pagamento
async function checkPaymentStatus(transactionId: string): Promise<string> {
    // Aqui você faria a verificação real com o serviço de pagamento
    return 'pending'; // Apenas um exemplo
}
