'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './DynamincPay.module.css';

export default function DynamicPayClient() {
    const searchParams = useSearchParams();
    const method = searchParams?.get('method');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);

    useEffect(() => {
        const localData = localStorage.getItem('checkoutData');
        const userData = localData ? JSON.parse(localData) : null;

        if (!userData) return;

        const payload = {
            amount: 50,
            description: 'Produto Exemplo',
            email: userData.email,
            first_name: userData.nome,
            last_name: userData.sobrenome,
        };

        if (method === 'pix') {
            console.log('DynamicPayClient:', { method, payload });
            fetch('/api/create-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    console.log('Status da resposta PIX:', res.status);
                    return res.json();
                })
                // dentro do seu useEffect, logo após .then(res => res.json())
                .then((data) => {
                    console.log('📡 resposta /api/create-pix →', data);
                    if (data.qrBase64) {
                        setQrCode(data.qrBase64);
                    } else {
                        console.warn('⚠️ qrBase64 não veio no JSON:', data);
                    }
                })
                .catch((err) => console.error('❌ Erro no fetch /api/create-pix:', err));
        }

        if (method === 'boleto') {
            fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.qrBase64) setQrCode(data.qrBase64);
                });
        }
    }, [method]);

    return (
        <div className={styles.container}>
            <h1>Finalizar Pagamento</h1>

            {qrCode ? (
                <Image unoptimized width={300} height={300} src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" />
            ) : (
                <p>Gerando QR Code…</p>
            )}

            {method === 'boleto' && (
                <div>
                    <h2>Pagamento com Boleto</h2>
                    {boletoUrl ? (
                        <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
                            Clique aqui para abrir o boleto
                        </a>
                    ) : (
                        <p>Gerando boleto…</p>
                    )}
                </div>
            )}
            {method === 'card' && (
                <div>
                    <h2>Pagamento com Cartão</h2>
                    <p>Formulário de cartão será renderizado aqui usando o SDK do Mercado Pago.</p>
                </div>
            )}
        </div>
    );
}
