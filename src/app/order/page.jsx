import { Suspense } from 'react';
import OrderPage from './orderPageClient';
import Loading from '../components/Loading/Loading';

export default function OrderPageWrapper() {
    return (
        <Suspense fallback={<Loading />}>
            <OrderPage />
        </Suspense>
    );
}
