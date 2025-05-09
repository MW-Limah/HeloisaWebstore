'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './DynamicPayClient.module.css';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { useCart } from '@/app/components/Cart/CartContext';

type DynamicPayClientProps = {
    paymentMethod: 'pix' | 'boleto' | 'card';
    total: number;
};

export default function DynamicPayClient({ paymentMethod, total }: DynamicPayClientProps) {
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState<boolean | null>(null);
    const [showReturnButton, setShowReturnButton] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);

    const { getSelectedItems } = useCart();
    const selectedItems = getSelectedItems();

    const [checkoutData, setCheckoutData] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('checkoutData');
        setCheckoutData(stored ? JSON.parse(stored) : {});
    }, []);

    const createPayment = useCallback(
        async (txId: string) => {
            try {
                const payload = {
                    amount: total,
                    description: 'Pagamento na Heloisa Store',
                    email: checkoutData.email,
                    first_name: checkoutData.nome,
                    last_name: checkoutData.sobrenome,
                    paymentMethod,
                    transactionId: txId,
                };
                const res = await fetch('/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();

                if (paymentMethod === 'pix' && data.qrCode) {
                    setPixCode(data.qrCode);
                    setPaymentId(data.paymentId);
                    setPaymentStatus('Pagamento criado e pendente...');
                } else if (paymentMethod === 'boleto' && data.boletoUrl) {
                    setBoletoUrl(data.boletoUrl);
                    setPaymentStatus('Boleto gerado e pronto para pagamento.');
                } else {
                    setPaymentStatus('Erro ao gerar pagamento.');
                }
            } catch (error) {
                console.error('Erro ao criar pagamento:', error);
                setPaymentStatus('Erro ao criar pagamento.');
            }
        },
        [checkoutData, paymentMethod, total]
    );

    useEffect(() => {
        if (!checkoutData) return;
        const txId = `TX${Date.now()}HWS`;
        setTransactionId(txId);
        setPaymentStatus('Iniciando pagamento...');
        createPayment(txId);
    }, [checkoutData, paymentMethod, total, createPayment]);

    const checkPaymentStatus = useCallback(async (paymentId: string) => {
        try {
            const res = await fetch(`https://backend-lojaheloisa.onrender.com/payment-status/${paymentId}`);
            const data = await res.json();

            if (data.status === 'paid') {
                setPaymentStatus('Pagamento confirmado!');
                setIsPaymentComplete(true);
            } else if (data.status === 'pending') {
                setPaymentStatus('Pagamento ainda pendente...');
                setIsPaymentComplete(false);
            } else {
                setPaymentStatus('Status desconhecido.');
            }
        } catch (error) {
            console.error('Erro ao verificar status no backend:', error);
            setPaymentStatus('Erro ao verificar status do pagamento.');
        }
    }, []);

    useEffect(() => {
        if (paymentId) {
            const interval = setInterval(() => checkPaymentStatus(paymentId), 5000);
            return () => clearInterval(interval);
        }
    }, [paymentId, checkPaymentStatus]);

    const handleConfirm = async () => {
        setSending(true);
        setSentSuccess(null);
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
            if (!res.ok) throw new Error(`Status ${res.status}: ${body}`);
            setSentSuccess(true);
            setShowReturnButton(true);
        } catch (err) {
            setSentSuccess(false);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Finalizar Pagamento</h1>
            <div className={styles.content}>
                {paymentMethod === 'pix' && pixCode && (
                    <>
                        {pixCode.startsWith('0002') ? (
                            <QRCode value={pixCode} size={300} />
                        ) : (
                            <Image
                                src={`data:image/png;base64,${pixCode}`}
                                alt="QR Code Pix"
                                width={300}
                                height={300}
                            />
                        )}
                        <textarea className={styles.textPix} readOnly value={pixCode} />
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
                        {copied && <p className={styles.toast}>Código Pix copiado!</p>}
                    </>
                )}

                {paymentMethod === 'boleto' && boletoUrl && (
                    <div>
                        <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
                            Clique para abrir o boleto
                        </a>
                    </div>
                )}

                {paymentMethod === 'card' && (
                    <div>
                        <p>Formulário via SDK Mercado Pago aqui.</p>
                    </div>
                )}

                {paymentStatus && <p className={styles.statusMessage}>{paymentStatus}</p>}

                <button className={styles.ConfirmPay} onClick={handleConfirm} disabled={sending || !isPaymentComplete}>
                    {sending ? 'Enviando...' : 'Finalizar pagamento'}
                </button>

                {sentSuccess === true && <p className={styles.successMsg}>Dados enviados!</p>}
                {sentSuccess === false && <p className={styles.errorMsg}>Erro ao enviar.</p>}
                {showReturnButton && (
                    <button className={styles.ReturnHome} onClick={() => (window.location.href = '/')}>
                        Voltar à tela inicial
                    </button>
                )}
            </div>
        </div>
    );
}
