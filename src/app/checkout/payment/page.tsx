// src/app/Finishing/checkout/payment/page.tsx
import { Suspense } from 'react';
import DynamicPayClient from './DynamicPayClient';

export default function PaymentPage() {
    return (
        <Suspense fallback={<p>Carregando pagamento…</p>}>
            <DynamicPayClient />
        </Suspense>
    );
}
