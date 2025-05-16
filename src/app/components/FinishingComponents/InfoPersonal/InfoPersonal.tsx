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
                    Já tem um cadastro?{' '}
                    <button
                        type="button"
                        onClick={async () => {
                            const {
                                data: { user },
                                error: authError,
                            } = await supabase.auth.getUser();

                            if (authError || !user) {
                                console.error('Usuário não autenticado.');
                                return;
                            }

                            const { data: client, error } = await supabase
                                .from('clients')
                                .select('email, first_name, last_name, phone')
                                .eq('id', user.id)
                                .single();

                            if (error) {
                                console.error('Erro ao buscar cliente:', error.message);
                                return;
                            }

                            updateFormData('email', client.email || '');
                            updateFormData('nome', client.first_name || '');
                            updateFormData('sobrenome', client.last_name || '');
                            updateFormData('telefone', client.phone || '');
                        }}
                        className={styles.loadButton}
                    >
                        Clique aqui
                    </button>
                    . Isso agiliza o checkout!
                </p>
            </div>
        </div>
    );
};
