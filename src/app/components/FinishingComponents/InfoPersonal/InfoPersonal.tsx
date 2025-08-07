'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export const InfoPersonal = ({ formData, updateFormData }) => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function loadUserData() {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) return;

            setUserId(user.id);

            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', user.id)
                .single();

            if (clientError && clientError.code === 'PGRST116') {
                // Não existe ainda, então cria
                await supabase.from('clients').insert({
                    id: user.id,
                    first_name: formData.nome,
                    last_name: formData.sobrenome,
                    email: formData.email,
                    phone: formData.telefone,
                });
            } else if (clientData) {
                // Já existe, então atualiza os dados
                await supabase
                    .from('clients')
                    .update({
                        first_name: formData.nome,
                        last_name: formData.sobrenome,
                        email: formData.email,
                        phone: formData.telefone,
                    })
                    .eq('id', user.id);
            }
        }

        loadUserData();
    }, [formData]);

    return (
        <div className={styles.InfoPersonal}>
            <div className={styles.content}>
                <h4>Informações pessoais</h4>
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
                        required
                    />
                    <div className={styles.nameInputs}>
                        <input
                            type="text"
                            placeholder="Nome*"
                            value={formData.nome}
                            onChange={(e) => updateFormData('nome', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Sobrenome*"
                            value={formData.sobrenome}
                            onChange={(e) => updateFormData('sobrenome', e.target.value)}
                            required
                        />
                    </div>
                    <input
                        type="tel"
                        placeholder="Telefone*"
                        value={formData.telefone}
                        onChange={(e) => updateFormData('telefone', e.target.value)}
                        required
                        pattern="^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$"
                    />
                </form>
            </div>
        </div>
    );
};
