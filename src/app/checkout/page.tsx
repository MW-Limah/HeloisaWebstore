'use client';

import { useState } from 'react';
import styles from './checkout.module.css';
import JustTop from '@/app/components/nav/justTop';
import Gallery from '@/app/components/Checkout/Gallery/Gallery';
import Comments from '@/app/components/Checkout/Comments/Comments';
import CheckoutForm from '@/app/components/Checkout/CheckoutForm/CheckoutForm';

export default function CheckOut() {
    const [highlighted, setHighlighted] = useState('/images/lineMenu/itens/item9.jpg');
    const [thumbnails, setThumbnails] = useState([
        '/images/lineMenu/itens/item1.jpg',
        '/images/lineMenu/itens/item2.jpg',
        '/images/lineMenu/itens/item3.jpg',
    ]);

    const handleImageClick = (clickedImage: string, index: number) => {
        const newThumbnails = [...thumbnails];
        newThumbnails[index] = highlighted;
        setHighlighted(clickedImage);
        setThumbnails(newThumbnails);
    };

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.leftSide}>
                    <Gallery highlighted={highlighted} thumbnails={thumbnails} onImageClick={handleImageClick} />
                    <Comments />
                </div>
                <div className={styles.rightSide}>
                    <CheckoutForm />
                </div>
            </div>
        </div>
    );
}
