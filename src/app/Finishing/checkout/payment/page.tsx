'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function DynamicPay() {
    const searchParams = useSearchParams();
    const method = searchParams.get('method');

    const [qrCode, setQrCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (method === 'pix') {
            fetch('/api/create-pix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 50,
                    description: 'Produto Exemplo',
                    email: 'comprador@email.com',
                    first_name: 'João',
                    last_name: 'Silva',
                }),
            })
                .then((res) => res.json())
                .then((base64) => setQrCode(base64));
        }

        if (method === 'boleto') {
            fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 50,
                    description: 'Produto Exemplo',
                    email: 'comprador@email.com',
                    first_name: 'João',
                    last_name: 'Silva',
                }),
            })
                .then((res) => res.json())
                .then((data) => setBoletoUrl(data.boleto_url));
        }
    }, [method]);

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Finalizar Pagamento</h1>

            {method === 'pix' && (
                <div>
                    <h2>Pagamento com Pix</h2>
                    {qrCode ? (
                        <Image width={300} height={300} src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" />
                    ) : (
                        <p>Gerando QR Code...</p>
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
                        <p>Gerando boleto...</p>
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
