'use client';

import styles from './contato.module.css';
import JustTop from '@/app/components/nav/justTop';
import { RiInstagramFill } from 'react-icons/ri';
import { IoLogoWhatsapp } from 'react-icons/io';
import { FaPinterest } from 'react-icons/fa';
import { useState } from 'react';

export default function Contato() {
    const [status, setStatus] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            nome: formData.get('nome') as string,
            sobrenome: formData.get('sobrenome') as string,
            email: formData.get('email') as string,
            mensagem: formData.get('mensagem') as string,
        };

        const res = await fetch('/api/client-msg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            setStatus('Mensagem enviada com sucesso!');
            form.reset();
        } else {
            setStatus('Erro ao enviar mensagem. Tente novamente.');
        }
    }

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                {/* Formulário de e-mail */}
                <div className={styles.form}>
                    <h2>Nos envie um e-mail</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.name}>
                            <input name="nome" type="text" placeholder="Seu nome" required />
                            <input name="sobrenome" type="text" placeholder="Sobrenome" required />
                        </div>
                        <input name="email" type="email" placeholder="E-mail" required />
                        <h3>Mensagem</h3>
                        <textarea name="mensagem" placeholder="Digite sua mensagem..." required></textarea>
                        <p>Por favor, seja educado.</p>
                        <div className={styles.buttonPanel}>
                            <button className={styles.sendBtn} type="submit">
                                Enviar
                            </button>
                        </div>
                        {status && <p>{status}</p>}
                    </form>
                </div>

                {/* Detalhes de contato */}
                <div className={styles.info}>
                    <h2>Detalhes de contato</h2>
                    <h3>E-mail</h3>
                    <p>loja.heloisaofc@gmail.com</p>
                    <h3>Redes Sociais</h3>
                    <div className={styles.redesSociais}>
                        <ul>
                            <li>
                                <IoLogoWhatsapp /> (92) 9987-5435
                            </li>
                            <li>
                                <RiInstagramFill />{' '}
                                <a
                                    href="https://www.instagram.com/hanel.h.h/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    hanel.h.h
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
