'use client';

import styles from './Finishing.module.css';
import { InfoPersonal } from '../components/FinishingComponents/InfoPersonal/InfoPersonal';
import Address from '../components/FinishingComponents/Address/Addres';
import PayMethods from '../components/FinishingComponents/PayMethods/PayMethods';
import ResumeCart from '../components/FinishingComponents/ResumeCart/ResumeCart';
import JustTop from '../components/nav/justTop';
import { useState } from 'react';

export default function Finishing() {
    const [paymentMethod, setPaymentMethod] = useState('pix');

    const handleFinalize = async () => {
        const res = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentMethod,
                // Adicione aqui os dados do pedido, total, produtos etc.
            }),
        });

        const data = await res.json();
        if (data.init_point) {
            // redireciona para o link do Mercado Pago (Pix/Boleto/etc)
            window.location.href = data.init_point;
        } else {
            alert('Erro ao iniciar pagamento');
        }
    };
    return (
        <div className={styles.allContent}>
            <JustTop />
            <div className={styles.container}>
                <h1>Finalizar compra</h1>
                <p>Preencha os campos abaixo, depois clique em finalizar compra ✨</p>
                <div className={styles.content}>
                    <div>
                        <InfoPersonal />
                        <Address />
                        <PayMethods onPaymentMethodChange={setPaymentMethod} />
                        <button onClick={handleFinalize}>Finalizar compra</button>
                    </div>
                    <div>
                        <ResumeCart paymentMethod={paymentMethod} />
                    </div>
                </div>
            </div>
        </div>
    );
}
