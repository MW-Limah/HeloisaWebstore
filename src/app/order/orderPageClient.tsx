'use client';

import styles from './order.module.css';
import JustTop from '../components/nav/justTop';
import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfirmationModal from '../components/confirmModal/confirmModal';
import { createClient } from '@supabase/supabase-js';

export default function OrderPage() {
    const searchParams = useSearchParams();
    const [showModal, setShowModal] = useState(false);

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    // Detalhes da encomenda

    const id = searchParams.get('id') || '';
    const title = searchParams.get('title') || '';
    const price = searchParams.get('price') || '';
    const image = searchParams.get('image') || '/Hlogo.png';
    const quantity = searchParams.get('quantity') || '';
    const color = searchParams.get('color') || '';

    const total = (Number(price) * Number(quantity)).toFixed(2);

    // Detalhes do cliente

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async () => {
        setStatus('Enviando...');
        const { error } = await supabase.from('reservations').insert([
            {
                product_id: id,
                product_title: title,
                product_image: image,
                quantity: Number(quantity),
                color,
                price: Number(price),
                total: Number(total),
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                message,
            },
        ]);

        if (error) {
            console.error(error);
            setStatus('Erro ao enviar a reserva.');
        } else {
            setStatus('Reserva enviada com sucesso!');
        }
    };

    return (
        <div className={styles.container}>
            <JustTop />

            <div className={styles.content}>
                <div className={styles.Details}>
                    <div className={styles.details}>
                        <h2>Quero reservar esse produto</h2>

                        <div className={styles.info}>
                            <label htmlFor="">Produto: </label>
                            <input type="text" readOnly value={title} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Código: </label>
                            <input type="text" readOnly value={id} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Quantidade: </label>
                            <input type="text" readOnly value={quantity} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Cor: </label>
                            <input type="text" readOnly value={color} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Valor: </label>
                            <input
                                type="text"
                                readOnly
                                value={`R$ ${(Number(price) * Number(quantity)).toFixed(2).replace('.', ',')}`}
                            />
                        </div>

                        <div className={styles.imgWrapper}>
                            <Image
                                src={image}
                                alt="Imagem do produto"
                                width={200}
                                height={200}
                                className={styles.productImage}
                            />
                        </div>
                    </div>

                    <div className={styles.clientDetails}>
                        <h2>Detalhes do cliente</h2>
                        <div className={styles.clientInfo}>
                            <input
                                type="text"
                                placeholder="Nome"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.clientInfo}>
                            <input
                                type="text"
                                placeholder="Sobrenome"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.clientInfo}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.clientInfo}>
                            <input
                                type="tel"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.clientMsg}>
                            <label htmlFor="">Mensagem: </label>
                            <textarea
                                placeholder="Digite sua mensagem aqui"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <p>Por favor, seja educado.</p>
                            <p>Iremos responder em breve pelos dados enviados acima.</p>
                        </div>
                        <div className={styles.buttonSend}>
                            <button onClick={() => setShowModal(true)}>Enviar Pedido</button>
                            <p>{status}</p>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <ConfirmationModal
                    onConfirm={async () => {
                        setShowModal(false);
                        await handleSubmit();
                    }}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
