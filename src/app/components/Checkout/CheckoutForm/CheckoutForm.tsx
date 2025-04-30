'use client';

import styles from './CheckoutForm.module.css';
import { useCart } from '@/app/components/Cart/CartContext';
import { useState } from 'react';
import Link from 'next/link';

interface CheckoutFormProps {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    images: string[];
    colors?: string[];
    quantities?: number[];
}

export default function CheckoutForm({
    id,
    title,
    description,
    price,
    image,
    images = [],
    colors = [],
    quantities = [],
}: CheckoutFormProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState<number>(quantities.length > 0 ? quantities[0] : 0);
    const [color, setColor] = useState<string>(colors.length > 0 ? colors[0] : '');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = () => {
        if (quantity === 0 || color === '') {
            alert('Selecione uma quantidade e uma cor antes de adicionar ao carrinho.');
            return;
        }

        addToCart({
            id,
            title,
            price: Number(price),
            image,
            images: images.length > 0 ? images : [image], // ✅ array de imagens
            quantity,
            color,
            maxQuantity: quantities.length > 0 ? Math.max(...quantities) : 1,
        });

        alert('Produto adicionado ao carrinho! 🛒');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (quantity === 0 || color === '') {
            alert('Selecione uma quantidade e uma cor antes de finalizar a compra.');
            return;
        }

        console.log('Finalizando compra com dados:', {
            ...formData,
            product: { id, title, quantity, color },
        });

        alert('Compra finalizada com sucesso! 🎉');
    };

    return (
        <form className={styles.checkoutForm} onSubmit={handleSubmit}>
            <h2>Check-out</h2>
            <h3 className={styles.itemTitle}>{title}</h3>
            <p className={styles.itemDescription}>{description}</p>

            <div className={styles.finishing}>
                <div className={styles.topFinish}>
                    <div className={styles.finishItem}>
                        <label className={styles.labell} htmlFor="quantity">
                            Quantidade
                        </label>
                        <select
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {quantities.length > 0 ? (
                                quantities.map((qtd) => (
                                    <option key={qtd} value={qtd}>
                                        {qtd}
                                    </option>
                                ))
                            ) : (
                                <option value={0}>Nenhuma quantidade disponível</option>
                            )}
                        </select>
                    </div>

                    <div className={styles.finishItem}>
                        <label htmlFor="color">Cor</label>
                        <select id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)}>
                            {colors.length > 0 ? (
                                colors.map((cor) => (
                                    <option key={cor} value={cor}>
                                        {cor}
                                    </option>
                                ))
                            ) : (
                                <option value="">Nenhuma cor disponível</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className={styles.bottomFinish}>
                    <h3 className={styles.price}>R$ {price}</h3>
                    <p>R$ {Number(price) - 2},00 + 2,00 (entrega)</p>

                    <div className={styles.buttonsWrapper}>
                        <button type="button" className={styles.buttonAddCart} onClick={handleAddToCart}>
                            Adicionar ao carrinho
                        </button>
                        <Link href={'/Finishing'}>
                            <button type="submit" className={styles.buttonFinish}>
                                Finalizar compra
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
