'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import styles from './LatestReleases.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface ReleaseItem {
    id: string;
    title: string;
    images: string[];
    price: string;
    created_at: string;
}

export default function LatestReleases() {
    const [items, setItems] = useState<ReleaseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReleases = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('box-items')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;

                const parsed = data.map((item: ReleaseItem) => ({
                    ...item,
                    price: Number((item.price ?? '0').toString().replace(',', '.')).toFixed(2),
                }));

                setItems(parsed);
            } catch (err: any) {
                setError('Erro ao carregar últimos lançamentos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReleases();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;
    if (!items.length) return <p>Nenhum item encontrado.</p>;

    return (
        <section className={styles.container}>
            <article className={styles.top}>
                <h2 className={styles.title}>Últimos Lançamentos</h2>
            </article>

            <article className={styles.bottom}>
                <div className={styles.releases}>
                    {items.map((item) => (
                        <div key={item.id}>
                            <Link href={`/checkout/${item.id}`}>
                                <div className={styles.ImageWrapper}>
                                    {item.images?.[0] && (
                                        <Image
                                            src={item.images[0]}
                                            alt={item.title}
                                            width={750}
                                            height={750}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                            </Link>

                            <h3>{item.title}</h3>

                            <p>
                                {Number(item.price).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
}
