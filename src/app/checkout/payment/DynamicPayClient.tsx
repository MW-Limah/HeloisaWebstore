'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './DynamicPayClient.module.css';
import { QRCode } from 'react-qrcode-logo';
import { payload as pixPayload } from 'pix-payload';

type DynamicPayClientProps = {
    paymentMethod: 'pix' | 'boleto' | 'card';
    total: number;
};

export default function DynamicPayClient({ paymentMethod, total }: DynamicPayClientProps) {
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Normaliza texto: maiúsculas, remove acentos, pontuação e caracteres especiais
    // Atualize a função normalize
    const normalize = useCallback((str: string, maxLen: number): string => {
        return str
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Corrigido aqui
            .replace(/[^A-Z0-9 ]/g, '') // Mantém apenas letras, números e espaço
            .substring(0, maxLen);
    }, []);

    // Gera payload Pix usando pixPayload()
    const generatePixCode = useCallback(
        (amount: number, txId: string): string => {
            // Formata o valor com 2 casas decimais e remove zeros à direita
            const formattedAmount = Number(amount).toFixed(2);

            const key = 'loja.heloisaofc@gmail.com';
            const name = normalize('Heloisa Loja Virtual', 25);
            const city = normalize('Manaus', 15);
            const transactionId = normalize(txId, 25);

            try {
                const value = pixPayload({
                    key,
                    name,
                    city,
                    amount: Number(formattedAmount),
                    transactionId,
                });

                console.log('Generated Pix Payload:', value);
                return value;
            } catch (error) {
                console.error('Erro ao gerar payload PIX:', error);
                throw error;
            }
        },
        [normalize]
    );

    useEffect(() => {
        // Recupera dados do checkout
        let checkoutData: any = null;
        try {
            const stored = localStorage.getItem('checkoutData');
            checkoutData = stored ? JSON.parse(stored) : null;
        } catch (err) {
            console.error('Erro ao parsear checkoutData:', err);
            return;
        }
        if (!checkoutData) return;

        // Atualiza o total no localStorage se estiver ausente ou diferente
        if (checkoutData.total !== total) {
            const updated = { ...checkoutData, total };
            localStorage.setItem('checkoutData', JSON.stringify(updated));
            checkoutData = updated;
        }

        // Gera um ID de transação único baseado no timestamp
        const txId = `TX${Date.now()}HWS`;

        // Formata o valor corretamente
        const formattedAmount = Number(total).toFixed(2);

        const meta = {
            amount: Number(formattedAmount),
            description: 'Pagamento na Heloisa Store',
            email: checkoutData.email,
            first_name: checkoutData.nome,
            last_name: checkoutData.sobrenome,
            transactionId: txId,
        };

        // Gera Pix
        if (paymentMethod === 'pix') {
            const finalAmount = Number(total.toFixed(2));
            const code = generatePixCode(finalAmount, txId);
            setPixCode(code);
        }

        // Gera Boleto
        if (paymentMethod === 'boleto') {
            (async () => {
                try {
                    const res = await fetch('/api/create-boleto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(meta),
                    });
                    const data = await res.json();
                    if (data.boletoUrl) setBoletoUrl(data.boletoUrl);
                } catch (err) {
                    console.error('Erro ao criar boleto:', err);
                }
            })();
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
                    {/* Exibe total atualizado */}
                    <p>Total: R$ {total.toFixed(2)}</p>
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
                    <p>Total: R$ {total.toFixed(2)}</p>
                </div>
            )}

            {paymentMethod === 'card' && (
                <div>
                    <h2>Pagamento com Cartão</h2>
                    <p>Formulário de cartão será renderizado aqui usando o SDK do Mercado Pago.</p>
                    <p>Total: R$ {total.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}
