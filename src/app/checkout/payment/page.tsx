'use client';

// src/app/checkout/payment/page.tsx
import { Suspense, useEffect, useState } from 'react';
import DynamicPayClient from './DynamicPayClient';

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'card'>('pix');
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        // Tente obter o total do localStorage ou de outro lugar
        const localData = localStorage.getItem('checkoutData');
        const checkoutData = localData ? JSON.parse(localData) : null;

        if (checkoutData) {
            // Definindo o total baseado nos dados do checkout
            setTotal(checkoutData.total || 0);
            setPaymentMethod(checkoutData.paymentMethod || 'pix');
        }
    }, []);

    return (
        <Suspense fallback={<p>Carregando pagamento…</p>}>
            <DynamicPayClient paymentMethod={paymentMethod} total={total} />
        </Suspense>
    );
}
