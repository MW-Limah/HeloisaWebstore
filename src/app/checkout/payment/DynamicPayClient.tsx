'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './DynamincPay.module.css';
import { QRCode } from 'react-qrcode-logo';
import { payload as pixPayload } from 'pix-payload';

type DynamicPayClientProps = {
    paymentMethod: 'pix' | 'boleto' | 'card';
    total: number;
};

export default function DynamicPayClient({ paymentMethod, total }: DynamicPayClientProps) {
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);

    // Normaliza texto: maiúsculas, remove acentos, pontuação e caracteres especiais
    const normalize = useCallback((str: string, maxLen: number): string => {
        return str
            .toUpperCase()
            .normalize('NFD') // separa acentos
            .replace(/[̀-\u036f]/g, '') // remove diacríticos
            .replace(/[^A-Z0-9 ]/g, '') // remove pontuação e símbolos
            .substring(0, maxLen); // limita ao tamanho máximo
    }, []);

    // Gera payload Pix usando pixPayload()
    const generatePixCode = useCallback(
        (amount: number, txId: string): string => {
            const key = 'loja.heloisaofc@gmail.com';
            const name = normalize('Heloisa Loja Virtual', 25);
            const city = normalize('Manaus', 15);
            const transactionId = normalize(txId, 25);

            const value = pixPayload({
                key,
                name,
                city,
                amount,
                transactionId,
            });

            console.log('Generated Pix Payload:', value);
            return value;
        },
        [normalize]
    );

    useEffect(() => {
        const localData = localStorage.getItem('checkoutData');
        const userData = localData ? JSON.parse(localData) : null;
        if (!userData || typeof total !== 'number' || isNaN(total)) return;

        const txId = 'TX12345HWS';
        const meta = {
            amount: total,
            description: 'Pagamento na Heloisa Store',
            email: userData.email,
            first_name: userData.nome,
            last_name: userData.sobrenome,
            transactionId: txId,
        };

        if (paymentMethod === 'pix') {
            const code = generatePixCode(total, txId);
            setPixCode(code);
        }

        if (paymentMethod === 'boleto') {
            fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meta),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.boletoUrl) setBoletoUrl(data.boletoUrl);
                });
        }
    }, [paymentMethod, total, generatePixCode]);

    return (
        <div className={styles.container}>
            <h1>Finalizar Pagamento</h1>

            {paymentMethod === 'pix' && (
                <>
                    {pixCode ? (
                        <>
                            <QRCode value={pixCode} size={300} />
                            <p style={{ wordBreak: 'break-word', fontSize: '0.75rem', marginTop: '1rem' }}>{pixCode}</p>
                        </>
                    ) : (
                        <p>Gerando QR Code…</p>
                    )}
                </>
            )}

            {paymentMethod === 'boleto' && (
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

            {paymentMethod === 'card' && (
                <div>
                    <h2>Pagamento com Cartão</h2>
                    <p>Formulário de cartão será renderizado aqui usando o SDK do Mercado Pago.</p>
                </div>
            )}
        </div>
    );
}
