'use client';

import { useState } from 'react';
import styles from './PayMethods.module.css';
import Image from 'next/image';

export default function PayMethods({ onPaymentMethodChange }) {
    const [paymentMethod, setPaymentMethod] = useState('pix');

    const handleChange = (e) => {
        const value = e.target.value;
        setPaymentMethod(value);
        onPaymentMethodChange(value); // envia para o componente pai
    };
    return (
        <div className={styles.PayMethods}>
            <div className={styles.content}>
                <h3>Métodos de pagamento</h3>
                <p className={styles.Subtitle}>Como você prefere fazer o pagamento?</p>
                <div className={styles.methodRow}>
                    <div className={styles.SelectWrapper}>
                        <select onChange={handleChange} value={paymentMethod}>
                            <option value="pix">Pix</option>
                            <option value="boleto">Boleto</option>
                            <option value="card">Cartão Crédito/Débito</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <Image width={25} height={25} alt="MasterCard Icone" src="/images/icons/mastercard.png" />
                <Image width={25} height={25} alt="PayPal Icone" src="/images/icons/paypal.png" />
                <Image width={25} height={25} alt="Pix Icone" src="/images/icons/pix.png" />
            </div>
        </div>
    );
}
