'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';
import { useForm } from '@/app/components/Checkout/CheckoutForm/FormContext';

export const InfoPersonal = ({ formData, updateFormData }) => {
    const { checkFormData, checkUpdateFormData } = useForm();
    return (
        <div className={styles.InfoPersonal}>
            <div className={styles.content}>
                <h3>Informações pessoais</h3>
                <ul className={styles.InfoList}>
                    <li>
                        Para saber mais sobre o uso de dados <Link href="/termos-de-uso">clique aqui.</Link>
                    </li>
                </ul>

                <form className={styles.ContentForm}>
                    <input
                        type="email"
                        placeholder="E-mail*"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                    />
                    <div className={styles.NameInputs}>
                        <input
                            type="text"
                            placeholder="Nome*"
                            value={formData.nome}
                            onChange={(e) => updateFormData('nome', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Sobrenome*"
                            value={formData.sobrenome}
                            onChange={(e) => updateFormData('sobrenome', e.target.value)}
                        />
                    </div>
                    <input
                        type="tel"
                        placeholder="Telefone*"
                        value={formData.telefone}
                        onChange={(e) => updateFormData('telefone', e.target.value)}
                    />
                    <p>Esses dados serão usados apenas para processar entregas.</p>
                </form>
            </div>

            <div className={styles.Bottom}>
                <p>
                    Já tem um cadastro? <Link href="#">Clique aqui</Link>. Isso agiliza o checkout!
                </p>
            </div>
        </div>
    );
};
