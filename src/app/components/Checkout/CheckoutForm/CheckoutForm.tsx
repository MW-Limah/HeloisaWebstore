'use client';

import styles from './CheckoutForm.module.css';
import { useCart } from '@/app/components/Cart/CartContext';
import { useState } from 'react';

interface CheckoutFormProps {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
}

export default function CheckoutForm({ id, title, description, price, image }: CheckoutFormProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState('verde');

    const handleAddToCart = () => {
        addToCart({
            id,
            title,
            price: Number(price),
            image,
            quantity,
            color,
        });

        alert('Produto adicionado ao carrinho! 🛒');
    };

    return (
        <form className={styles.checkoutForm}>
            <h2>Check-out</h2>
            <h3 className={styles.itemTitle}>{title}</h3>
            <p className={styles.itemDescription}>{description}</p>

            <div className={styles.inputGroup}>
                <label htmlFor="name">Qual seu nome?</label>
                <input type="text" id="name" name="name" required />
            </div>

            <div className={styles.contactClient}>
                <h3>Seu contato</h3>
                <div className={styles.contactInputs}>
                    <div className={styles.inputGroupContact}>
                        <label htmlFor="phone">Telefone</label>
                        <input type="text" id="phone" name="phone" required />
                    </div>
                    <div className={styles.inputGroupContact}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="address">Qual seu endereço?</label>
                <input type="text" id="address" name="address" required />
            </div>

            <div className={styles.finishing}>
                <div className={styles.topFinish}>
                    <div className={styles.finishItem}>
                        <label className={styles.labell} htmlFor="quantity">
                            Em estoque
                        </label>
                        <select
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.finishItem}>
                        <label htmlFor="color">Cor</label>
                        <select id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)}>
                            {['verde', 'vermelho', 'azul', 'preto'].map((cor) => (
                                <option key={cor} value={cor}>
                                    {cor}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.bottomFinish}>
                    <h3 className={styles.price}>R$ {price}</h3>
                    <p>{Number(price) - 2},00 + 2,00 (entrega)</p>

                    <div className={styles.buttonsWrapper}>
                        <button type="button" className={styles.buttonAddCart} onClick={handleAddToCart}>
                            Adicionar ao carrinho
                        </button>

                        <button type="submit" className={styles.buttonFinish}>
                            Finalizar compra
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
