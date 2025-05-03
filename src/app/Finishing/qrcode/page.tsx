// src/app/checkout/qrcode/page.tsx  (ou onde você esteja exibindo o QR)
'use client';

import PixQRCode from '@/app/Finishing/qrcode/PixQRCode';
import styles from './qrcode.module.css';
import { useCart } from '@/app/components/Cart/CartContext';

export default function Finalizacao() {
    const { getSelectedTotal } = useCart();
    const total = getSelectedTotal();

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }} className={styles.container}>
            <h1>Pagamento com Pix</h1>
            {/* Passa o total dinâmico para o QR */}
            <PixQRCode
                chave="d41fe017-de5d-42f9-afbd-ab59159b8474"
                nome="Mauricio W. F. de Lima"
                cidade="Manaus"
                valor={total} // certifique-se de que total é um número válido (ex: 15.90)
                txid={`HEL-${Math.floor(Date.now() / 1000)}`}
            />
        </div>
    );
}
