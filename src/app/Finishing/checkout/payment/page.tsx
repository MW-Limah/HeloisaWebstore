'use client';

import { useSearchParams } from 'next/navigation';

export default function DynamicPay() {
    const searchParams = useSearchParams();
    const method = searchParams.get('method');

    return (
        <div>
            {method === 'pix' && <h2>Pagamento com Pix</h2>}
            {method === 'boleto' && <h2>Pagamento com Boleto</h2>}
            {method === 'card' && <h2>Pagamento com Cartão</h2>}
        </div>
    );
}
