'use client';

// src/app/checkout/payment/page.tsx
import { Suspense, useEffect, useState } from 'react';
import DynamicPayClient from './DynamicPayClient';
import { useCart } from '@/app/components/Cart/CartContext';

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'card'>('pix');
    const [total, setTotal] = useState<number>(0);
    const { getSelectedTotalWithFee } = useCart();

    useEffect(() => {
        const localData = localStorage.getItem('checkoutData');
        const checkoutData = localData ? JSON.parse(localData) : null;

        if (checkoutData) {
            const totalWithFee = getSelectedTotalWithFee();
            setTotal(totalWithFee); // ✅ valor com taxa
            setPaymentMethod(checkoutData.paymentMethod || 'pix');
        }
    }, [getSelectedTotalWithFee]);

    return (
        <Suspense fallback={<p>Carregando pagamento…</p>}>
            <DynamicPayClient paymentMethod={paymentMethod} total={total} />
        </Suspense>
    );
}
