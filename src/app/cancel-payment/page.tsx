import { Suspense } from 'react';
import CancelPaymentPage from './cancel-payment';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CancelPaymentPage />
        </Suspense>
    );
}
