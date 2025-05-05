'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import styles from './DynamincPay.module.css';

export default function DynamicPayClient() {
    const method = useSearchParams().get('method');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);

    useEffect(() => {
        const payload = {
            amount: 50,
            description: 'Produto Exemplo',
            email: 'comprador@email.com',
            first_name: 'João',
            last_name: 'Silva',
        };

        if (method === 'pix') {
            fetch('/api/create-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.qrBase64) setQrCode(data.qrBase64);
                    else console.error('Erro no response PIX', data);
                });
        }

        if (method === 'boleto') {
            fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.boletoUrl) setBoletoUrl(data.boletoUrl);
                    else console.error('Erro no response BOLETO', data);
                });
        }
    }, [method]);

    return (
        <div className={styles.container}>
            <h1>Finalizar Pagamento</h1>

            {method === 'pix' && (
                <div>
                    <h2>Pagamento com Pix</h2>
                    {qrCode ? (
                        <Image width={300} height={300} src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" />
                    ) : (
                        <p>Gerando QR Code…</p>
                    )}
                </div>
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
