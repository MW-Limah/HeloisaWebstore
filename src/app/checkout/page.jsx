'use client';

import styles from './Finishing.module.css';
import { InfoPersonal } from '../components/FinishingComponents/InfoPersonal/InfoPersonal';
import Address from '../components/FinishingComponents/Address/Address';
import PayMethods from '../components/FinishingComponents/PayMethods/PayMethods';
import ResumeCart from '../components/FinishingComponents/ResumeCart/ResumeCart';
import JustTop from '../components/nav/justTop';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Finishing() {
    const [paymentMethod, setPaymentMethod] = useState('pix');
    const [formData, setFormData] = useState({
        email: '',
        nome: '',
        sobrenome: '',
        telefone: '',
        cep: '',
        bairro: '',
        rua: '',
        numero: '',
    });

    const router = useRouter();

    const updateFormData = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFinish = () => {
        const { email, nome, sobrenome, telefone, cep, bairro, rua, numero } = formData;

        if (!email || !nome || !sobrenome || !telefone || !cep || !bairro || !rua || !numero) {
            alert('Por favor, Preencha todos os campos');
            return;
        }

        window.location.href = `/checkout/payment?method=${paymentMethod}`;
    };

    return (
        <div className={styles.allContent}>
            <JustTop />
            <div className={styles.container}>
                <h1>Finalizar compra</h1>
                <p>Preencha os campos abaixo, depois clique em finalizar compra ✨</p>
                <div className={styles.content}>
                    <div>
                        <InfoPersonal formData={formData} updateFormData={updateFormData} />
                        <Address formData={formData} updateFormData={updateFormData} />
                        <PayMethods onPaymentMethodChange={setPaymentMethod} />
                    </div>
                    <div>
                        <ResumeCart formData={formData} paymentMethod={paymentMethod} onFinish={handleFinish} />
                    </div>
                </div>
            </div>
        </div>
    );
}
