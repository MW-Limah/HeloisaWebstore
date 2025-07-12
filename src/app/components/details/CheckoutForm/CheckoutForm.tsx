'use client';

import styles from './CheckoutForm.module.css';
import { useCart } from '@/app/components/Cart/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
            selected: false,
        });

        alert('Produto adicionado ao carrinho! 🛒');
    };

    const router = useRouter();

    const handleOrder = () => {
        if (quantity === 0 || color === '') {
            alert('Selecione uma quantidade e uma cor antes de continuar.');
            return;
        }

        const params = new URLSearchParams({
            id,
            title,
            price,
            image,
            quantity: quantity.toString(),
            color,
        });

        router.push(`/order?${params.toString()}`); //
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
            <h2>Detalhes</h2>
            <h3 className={styles.itemTitle}>{title}</h3>
            <p className={styles.itemDescription}>{description}</p>

            {/* Seções movidas para o final */}
            <div className={styles.finishing}>
                <div className={styles.topFinish}>
                    {/* Quantidade */}
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

                    {/* Cor */}
                    <div className={styles.finishItem}>
                        <label htmlFor="color">Item/Cor</label>
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
                    <h3 className={styles.price}>R$ {Number(price).toFixed(2).replace('.', ',')}</h3>
                    <div className={styles.buttonsWrapper}>
                        <button type="button" className={styles.buttonAddCart} onClick={handleAddToCart}>
                            Adicionar ao carrinho
                        </button>
                        <Link href={'/cart'}>
                            <button type="submit" className={styles.buttonFinish}>
                                Ir para o carrinho
                            </button>
                        </Link>
                    </div>
                    <div className={styles.buttonsPanel}>
                        <p>Você pode reservar esse produto.</p>
                        <button type="button" onClick={handleOrder}>
                            Reservar esse produto
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
