'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './reservations.module.css';
import Image from 'next/image';

interface Reservation {
    id: string;
    created_at: string;
    product_id: string;
    product_title: string;
    product_image: string;
    quantity: number;
    color: string;
    price: number;
    total: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error) {
                setReservations(data);
            } else {
                console.error(error);
            }
        };

        fetchReservations();
    }, []);

    if (!reservations.length) return <p>Não há reservas.</p>;

    return (
        <div className={styles.shoppings}>
            <div className={styles.requests}>
                {reservations.map((r) => (
                    <div key={r.id} className={styles.requestCard}>
                        <div>
                            <h4>{r.product_title}</h4>

                            <ul>
                                <li>
                                    <label>ID:</label> <div className={styles.detail}> {r.product_id} </div>
                                </li>
                                <li>
                                    <label>Cor:</label> <div className={styles.detail}> {r.color} </div>
                                </li>
                                <li>
                                    <label>Quantidade:</label> <div className={styles.detail}> {r.quantity} </div>
                                </li>
                                <li>
                                    <label>Total:</label>{' '}
                                    <div className={styles.detail}> R$ {r.total.toFixed(2).replace('.', ',')} </div>
                                </li>
                            </ul>
                            <div className={styles.ImageContainer}>
                                <div className={styles.imageWrapper}>
                                    <label htmlFor="">Imagem</label>
                                    <Image
                                        className={styles.Img}
                                        src={r.product_image}
                                        alt={r.product_title}
                                        width={150}
                                        height={180}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.InfoClientes}>
                            <h4>Cliente</h4>
                            <ul>
                                <li>
                                    <label htmlFor="">Nome: </label>{' '}
                                    <div className={styles.detail}>
                                        {r.first_name} {r.last_name}{' '}
                                    </div>
                                </li>
                                <li>
                                    <label htmlFor="">Email:</label>
                                    <div className={styles.detail}>{r.email}</div>
                                </li>
                                <li>
                                    <label htmlFor="">Telefone:</label>
                                    <div className={styles.detail}>{r.phone}</div>
                                </li>
                                <li>
                                    <label>Mensagem:</label>
                                    <div className={styles.detail}>{r.message}</div>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.date}>
                            <h4>{new Date(r.created_at).toLocaleString()}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
