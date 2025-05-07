'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './DynamicPayClient.module.css';
import { QRCode } from 'react-qrcode-logo';
import { payload as pixPayload } from 'pix-payload';
import { useCart } from '@/app/components/Cart/CartContext';

type DynamicPayClientProps = {
    paymentMethod: 'pix' | 'boleto' | 'card';
    total: number;
};

export default function DynamicPayClient({ paymentMethod, total }: DynamicPayClientProps) {
    // — estados de UI —
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState<boolean | null>(null);
    const [showReturnButton, setShowReturnButton] = useState(false);

    // — carrinho —
    const { getSelectedItems } = useCart();
    const selectedItems = getSelectedItems();

    // — checkoutData lido só no cliente —
    const [checkoutData, setCheckoutData] = useState<any>(null);
    useEffect(() => {
        // roda só no browser
        const stored = localStorage.getItem('checkoutData');
        setCheckoutData(stored ? JSON.parse(stored) : {});
    }, []);

    // ============================
    // 1) Geração de Pix
    // ============================
    const normalize = useCallback((str: string, maxLen: number) => {
        return str
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^A-Z0-9 ]/g, '')
            .substring(0, maxLen);
    }, []);

    const generatePixCode = useCallback(
        (amount: number, txId: string) => {
            const formattedAmount = amount.toFixed(2);
            const key = 'loja.heloisaofc@gmail.com';
            const name = normalize('Heloisa Loja Virtual', 25);
            const city = normalize('Manaus', 15);
            const transactionId = normalize(txId, 25);

            const value = pixPayload({ key, name, city, amount: Number(formattedAmount), transactionId });
            return value;
        },
        [normalize]
    );

    useEffect(() => {
        if (!checkoutData) return; // aguarda o carregamento
        if (paymentMethod === 'pix') {
            const txId = `TX${Date.now()}HWS`;
            setPixCode(generatePixCode(total, txId));
        }
        if (paymentMethod === 'boleto') {
            const txId = `TX${Date.now()}HWS`;
            const meta = {
                amount: total.toFixed(2),
                description: 'Pagamento na Heloisa Store',
                email: checkoutData.email,
                first_name: checkoutData.nome,
                last_name: checkoutData.sobrenome,
                transactionId: txId,
            };
            fetch('/api/create-boleto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(meta),
            })
                .then((r) => r.json())
                .then((d) => d.boletoUrl && setBoletoUrl(d.boletoUrl))
                .catch(console.error);
        }
    }, [checkoutData, paymentMethod, total, generatePixCode]);

    // ============================
    // 2) Confirmação de pagamento
    // ============================
    const handleConfirm = async () => {
        setSending(true);
        setSentSuccess(null);

        // usa o estado carregado (ou pode reler localStorage aqui)
        const data = checkoutData ?? JSON.parse(localStorage.getItem('checkoutData') || '{}');

        const payload = {
            first_name: data.nome,
            last_name: data.sobrenome,
            email: data.email,
            total: total.toFixed(2),
            paymentMethod,
            pixCode,
            boletoUrl,
            timestamp: new Date().toISOString(),
            cep: data.cep,
            bairro: data.bairro,
            rua: data.rua,
            numero: data.numero,
            items: selectedItems.map((item) => ({
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                color: item.color,
                price: item.price,
            })),
        };

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const body = await res.text();
            console.log('[send-email] status:', res.status, 'body:', body);

            if (!res.ok) throw new Error(`Status ${res.status}: ${body}`);
            setSentSuccess(true);
            setShowReturnButton(true);
        } catch (err) {
            console.error('[handleConfirm] erro:', err);
            setSentSuccess(false);
        } finally {
            setSending(false);
        }
    };
    return (
        <div className={styles.container}>
            <h1>Finalizar Pagamento</h1>
            <div className={styles.content}>
                {/* === PIX === */}
                {paymentMethod === 'pix' && pixCode && (
                    <>
                        <QRCode value={pixCode} size={300} />

                        <div className={styles.AreaPix}>
                            <label htmlFor="pixCopyPaste">Pix Copia e Cola</label>
                            <textarea id="pixCopyPaste" className={styles.textPix} readOnly value={pixCode} />
                            <button
                                className={styles.CopyPix}
                                onClick={() => {
                                    navigator.clipboard.writeText(pixCode);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 3000);
                                }}
                            >
                                Copiar código Pix
                            </button>
                            {copied && <p className={styles.toast}>Código Pix copiado com sucesso!</p>}
                        </div>
                    </>
                )}
                {paymentMethod === 'pix' && <p className={styles.pTotal}>Total: R$ {total.toFixed(2)}</p>}

                {/* === BOLETO === */}
                {paymentMethod === 'boleto' && (
                    <div>
                        <h2>Pagamento com Boleto</h2>
                        {boletoUrl ? (
                            <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
                                Clique para abrir o boleto
                            </a>
                        ) : (
                            <p>Gerando boleto…</p>
                        )}
                        <p>Total: R$ {total.toFixed(2)}</p>
                    </div>
                )}

                {/* === CARTÃO === */}
                {paymentMethod === 'card' && (
                    <div>
                        <h2>Pagamento com Cartão</h2>
                        <p>Formulário via SDK Mercado Pago aqui.</p>
                        <p>Total: R$ {total.toFixed(2)}</p>
                    </div>
                )}

                {/* === BOTÃO “FINALIZAR” === */}
                <div className={styles.confirmPay}>
                    <button className={styles.ConfirmPay} onClick={handleConfirm} disabled={sending}>
                        {sending ? 'Enviando...' : 'Finalizar pagamento'}
                    </button>
                    {sentSuccess === true && (
                        <p className={styles.successMsg}>Dados enviados! Confira seu e-mail mais tarde.</p>
                    )}
                    {sentSuccess === false && (
                        <p className={styles.errorMsg}>Falha ao enviar dados. Tente novamente.</p>
                    )}
                    {showReturnButton && (
                        <button className={styles.ReturnHome} onClick={() => (window.location.href = '/')}>
                            Voltar à tela inicial
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
