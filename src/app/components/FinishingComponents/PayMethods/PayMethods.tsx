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
                <h4>Métodos de pagamento</h4>
                <p className={styles.Subtitle}>Como você prefere fazer o pagamento?</p>
                <div className={styles.methodRow}>
                    <div className={styles.SelectWrapper}>
                        <select onChange={handleChange} value={paymentMethod}>
                            <option value="pix">Pix</option>
                            {/* <option value="boleto">Boleto</option>
                            <option value="card">Cartão Crédito/Débito</option> */}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
