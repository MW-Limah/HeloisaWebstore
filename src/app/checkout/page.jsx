// src/app/checkout/Finishing/page.tsx
'use client';

import JustTop from '../components/nav/justTop';
import { useCart } from '@/app/components/Cart/CartContext'; // <-- importe o hook
import { InfoPersonal } from '../components/FinishingComponents/InfoPersonal/InfoPersonal';
import Address from '../components/FinishingComponents/Address/Address';
import PayMethods from '../components/FinishingComponents/PayMethods/PayMethods';
import ResumeCart from '../components/FinishingComponents/ResumeCart/ResumeCart';
import styles from './Finishing.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Finishing() {
    const { getSelectedTotal } = useCart(); // <-- pegue o total
    const taxa = 5;
    const totalComTaxa = getSelectedTotal() + taxa; // <-- calcule aqui

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
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFinish = () => {
        const { email, nome, sobrenome, telefone, cep, bairro, rua, numero } = formData;
        if (!email || !nome || !sobrenome || !telefone || !cep || !bairro || !rua || !numero) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        // grava dados completos, incluindo o total já calculado
        localStorage.setItem(
            'checkoutData',
            JSON.stringify({
                ...formData,
                paymentMethod,
                total: totalComTaxa, // <-- aqui!
            })
        );

        // navega para a página de pagamento
        router.push(`/checkout/payment`);
    };

    return (
        <div className={styles.allContent}>
            <JustTop />
            <div className={styles.container}>
                <h2>Finalizar compra</h2>
                <p>Preencha os campos abaixo e clique em finalizar compra ✨</p>
                <div className={styles.content}>
                    <div className={styles.form1}>
                        <InfoPersonal formData={formData} updateFormData={updateFormData} />
                        <Address formData={formData} updateFormData={updateFormData} />
                        <PayMethods onPaymentMethodChange={setPaymentMethod} />
                    </div>
                    <div className={styles.form2}>
                        <ResumeCart formData={formData} paymentMethod={paymentMethod} onFinish={handleFinish} />
                    </div>
                </div>
            </div>
        </div>
    );
}
