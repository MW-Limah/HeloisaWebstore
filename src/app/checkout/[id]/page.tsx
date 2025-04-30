'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import styles from './checkout.module.css';
import JustTop from '@/app/components/nav/justTop';
import Gallery from '@/app/components/Checkout/Gallery/Gallery';
import Comments from '@/app/components/Checkout/Comments/Comments';
import CheckoutForm from '@/app/components/Checkout/CheckoutForm/CheckoutForm';
import Loading from '@/app/components/Loading/Loading';

interface BoxItemData {
    id: string;
    title: string;
    images: string[];
    description: string;
    theme: string;
    price: string;
    quantities: number[];
    colors: string[];
}

export default function CheckoutPage() {
    const { id } = useParams();
    const [item, setItem] = useState<BoxItemData | null>(null);
    const [highlighted, setHighlighted] = useState('');
    const [thumbnails, setThumbnails] = useState<string[]>([]);

    useEffect(() => {
        async function fetchItem() {
            const { data, error } = await supabase.from('box-items').select('*').eq('id', id).single();

            if (error) {
                console.error('Erro ao buscar item:', error.message);
                return;
            }

            setItem(data);
            setHighlighted(data.images[0]);
            setThumbnails(data.images);
        }

        if (id) {
            fetchItem();
        }
    }, [id]);

    const handleImageClick = (clickedImage: string) => {
        setHighlighted(clickedImage);
    };

    if (!item) return <Loading />;

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.leftSide}>
                    <Gallery highlighted={highlighted} thumbnails={thumbnails} onImageClick={handleImageClick} />
                    <Comments />
                </div>
                <div className={styles.rightSide}>
                    <CheckoutForm
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        image={item.images[0]} // imagem principal
                        images={item.images} // ✅ passar todas as imagens
                        colors={item.colors || []}
                        quantities={item.quantities || []}
                    />
                </div>
            </div>
        </div>
    );
}
