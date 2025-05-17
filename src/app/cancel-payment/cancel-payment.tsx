'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './cancel.module.css';

export default function CancelPaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const paymentId = searchParams.get('paymentId');

    const [isCanceling, setIsCanceling] = useState(false);
    const [error, setError] = useState('');

    const handleCancel = async () => {
        if (!paymentId) {
            setError('ID do pagamento não encontrado.');
            return;
        }

        setIsCanceling(true);
        try {
            const res = await fetch('/api/cancel-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId }),
            });

            const data = await res.json();

            if (data.success) {
                alert('Pagamento cancelado com sucesso.');
                router.push('/'); // ou para onde desejar
            } else {
                setError(data.message || 'Erro ao cancelar.');
            }
        } catch (e) {
            setError('Erro ao tentar cancelar o pagamento.');
        } finally {
            setIsCanceling(false);
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <h2>Você quer cancelar o pagamento?</h2>
                    <p>{paymentId ? `ID do pagamento: ${paymentId}` : 'Pagamento não identificado.'}</p>
                </div>
                <div className={styles.buttons}>
                    <button onClick={handleCancel} disabled={isCanceling} className={styles.yes}>
                        {isCanceling ? 'Cancelando...' : 'Sim, cancelar'}
                    </button>
                    <button onClick={() => router.back()} className={styles.no}>
                        Não, voltar
                    </button>
                </div>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            </div>
        </main>
    );
}
