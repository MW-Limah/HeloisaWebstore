'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './DynamicPayClient.module.css';
import { QRCode } from 'react-qrcode-logo';
import Image from 'next/image';
import { useCart } from '@/app/components/Cart/CartContext';
import { useRouter } from 'next/navigation';

type DynamicPayClientProps = {
    paymentMethod: 'pix' | 'boleto' | 'card';
    total: number;
};

export default function DynamicPayClient({ paymentMethod, total }: DynamicPayClientProps) {
    const [pixCode, setPixCode] = useState<string | null>(null);
    const [pixQrBase64, setPixQrBase64] = useState<string | null>(null);
    const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState<boolean | null>(null);
    const [showReturnButton, setShowReturnButton] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const emailSentRef = useRef(false);
    const router = useRouter();

    const { getSelectedItems } = useCart();
    const selectedItems = getSelectedItems();

    const [checkoutData, setCheckoutData] = useState<any>(null);
    useEffect(() => {
        const stored = localStorage.getItem('checkoutData');
        setCheckoutData(stored ? JSON.parse(stored) : {});
    }, []);

    const handleConfirm = useCallback(async () => {
        setSending(true);
        setSentSuccess(null);
        const data = checkoutData || JSON.parse(localStorage.getItem('checkoutData') || '{}');

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
        } catch {
            setSentSuccess(false);
        } finally {
            setSending(false);
        }
    }, [boletoUrl, checkoutData, paymentMethod, pixCode, selectedItems, total]);

    const checkPaymentStatus = useCallback(
        async (pid: string) => {
            try {
                const res = await fetch(`https://backend-lojaheloisa.onrender.com/payment-status/${pid}`);
                const data = await res.json();
                if (data.status === 'paid') {
                    setPaymentStatus('Pagamento confirmado!');
                    setIsPaymentComplete(true);

                    const emailSentKey = `emailSent:${pid}`;
                    const alreadySent = localStorage.getItem(emailSentKey);

                    if (!alreadySent) {
                        localStorage.setItem(emailSentKey, 'true');
                        emailSentRef.current = true;
                        handleConfirm();
                    }
                } else if (data.status === 'pending') {
                    setPaymentStatus('Pagamento ainda pendente...');
                    setIsPaymentComplete(false);
                } else {
                    setPaymentStatus('Status desconhecido.');
                    setIsPaymentComplete(false);
                }
            } catch (err) {
                setPaymentStatus('Erro ao verificar status do pagamento.');
            }
        },
        [handleConfirm]
    );

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
                if (!res.ok) throw new Error(data.error || 'Erro desconhecido');

                if (data.paymentId) {
                    setPaymentId(data.paymentId);
                    localStorage.setItem('paymentId', data.paymentId);
                }
                if (data.qrCode) {
                    setPixCode(data.qrCode);
                    localStorage.setItem('pixCode', data.qrCode);
                }
                if (data.qrBase64) {
                    setPixQrBase64(data.qrBase64);
                    localStorage.setItem('pixQrBase64', data.qrBase64);
                }
                if (data.boletoUrl) {
                    setBoletoUrl(data.boletoUrl);
                    localStorage.setItem('boletoUrl', data.boletoUrl);
                }

                if (paymentMethod === 'pix') {
                    setPaymentStatus('Pagamento criado e pendente...');
                } else if (paymentMethod === 'boleto') {
                    setPaymentStatus('Boleto gerado e pronto para pagamento.');
                }
            } catch {
                setPaymentStatus('Erro ao criar pagamento.');
            }
        },
        [checkoutData, paymentMethod, total]
    );

    useEffect(() => {
        if (!checkoutData) return;

        const storedTxId = localStorage.getItem('transactionId');
        const storedPaymentId = localStorage.getItem('paymentId');
        const storedPixCode = localStorage.getItem('pixCode');
        const storedPixQrBase64 = localStorage.getItem('pixQrBase64');
        const storedBoletoUrl = localStorage.getItem('boletoUrl');

        if (storedPaymentId) {
            setPaymentId(storedPaymentId);
            if (storedPixCode) setPixCode(storedPixCode);
            if (storedPixQrBase64) setPixQrBase64(storedPixQrBase64);
            if (storedBoletoUrl) setBoletoUrl(storedBoletoUrl);
            setPaymentStatus('Retomando pagamento anterior...');
            return;
        }

        let txId = storedTxId;
        if (!txId) {
            txId = `TX${Date.now()}HWS`;
            localStorage.setItem('transactionId', txId);
        }

        setPaymentStatus('Iniciando pagamento...');
        createPayment(txId);
    }, [checkoutData, paymentMethod, total, createPayment]);

    useEffect(() => {
        if (paymentId) {
            const interval = setInterval(() => checkPaymentStatus(paymentId), 5000);
            return () => clearInterval(interval);
        }
    }, [paymentId, checkPaymentStatus]);

    return (
        <div className={styles.container}>
            <button className={styles.btnCancel} onClick={() => setShowCancelConfirm(true)}>
                Cancelar pagamento
            </button>

            {showCancelConfirm && (
                <div className={styles.confirmCancelBox}>
                    <div className={styles.confirmActions}>
                        <p>Tem certeza que deseja cancelar este pagamento?</p>
                        <button
                            onClick={() => {
                                localStorage.removeItem('transactionId');
                                localStorage.removeItem('paymentId');
                                localStorage.removeItem('pixCode');
                                localStorage.removeItem('pixQrBase64');
                                localStorage.removeItem('boletoUrl');
                                if (paymentId) {
                                    localStorage.removeItem(`emailSent:${paymentId}`);
                                }
                                setShowCancelConfirm(false);
                                router.push('/');
                            }}
                            className={styles.confirmBtn}
                        >
                            Confirmar cancelamento
                        </button>
                        <button onClick={() => setShowCancelConfirm(false)} className={styles.cancelBtn}>
                            Voltar
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.payMethod}>
                    {paymentMethod === 'pix' && (pixQrBase64 || pixCode) && (
                        <>
                            <div className={styles.qrArea}>
                                {pixQrBase64 ? (
                                    <Image
                                        src={`data:image/png;base64,${pixQrBase64}`}
                                        alt="QR Code Pix"
                                        width={300}
                                        height={300}
                                    />
                                ) : (
                                    <QRCode value={pixCode!} size={300} />
                                )}
                            </div>
                            <div className={styles.pixCode}>
                                {pixCode && (
                                    <>
                                        <div className={styles.Top}>
                                            <h3>Pague com Pix</h3>
                                            <p>Capture o QR-code com seu banco, ou copie o código disponibilizado.</p>
                                            <p>Para o código: </p>
                                            <ul>
                                                <li>1. Após copiar, abra o seu banco e procure a área pix.</li>
                                                <li>
                                                    2. Cole o código na área da chave pix, se não abrir automaticamente.
                                                </li>
                                                <li>3. Verifique seu e-mail.</li>
                                            </ul>
                                        </div>
                                        <div className={styles.textBtn}>
                                            <textarea readOnly value={pixCode} />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixCode);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 3000);
                                                }}
                                            >
                                                Copiar código Pix
                                            </button>
                                            {copied && <p className={styles.toast}>Código Pix copiado!</p>}
                                        </div>
                                    </>
                                )}
                            </div>
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
                </div>

                <div className={styles.statusArea}>
                    {paymentStatus && <p className={styles.statusMessage}>{paymentStatus}</p>}
                    {sentSuccess ? (
                        <button
                            className={styles.ConfirmPay}
                            onClick={() => {
                                localStorage.removeItem('checkoutData');
                                localStorage.removeItem('transactionId');
                                if (paymentId) localStorage.removeItem(`emailSent:${paymentId}`);
                                router.push('/');
                            }}
                        >
                            Voltar à loja
                        </button>
                    ) : (
                        <button
                            className={styles.ConfirmPay}
                            onClick={handleConfirm}
                            disabled={sending || !isPaymentComplete || emailSentRef.current}
                        >
                            {sending ? 'Enviando...' : 'Pendente'}
                        </button>
                    )}

                    {sentSuccess === true && <p className={styles.successMsg}>Dados enviados!</p>}
                    {sentSuccess === false && <p className={styles.errorMsg}>Erro ao enviar.</p>}
                </div>
            </div>
        </div>
    );
}
