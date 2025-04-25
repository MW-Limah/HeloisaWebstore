// src/app/cart/page.tsx
'use client';

import JustTop from '../components/nav/justTop';
import ButtonBack from '../components/buttonBack/buttonBack';
import { useCart } from '@/app/components/Cart/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cart.module.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className={styles.empty}>
                <h1>Seu carrinho está vazio 😢</h1>
                <Link href="/">Continuar comprando</Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <h1>Meu Carrinho</h1>
                <ul className={styles.list}>
                    {cart.map((item) => (
                        <li key={`${item.id}-${item.color}`} className={styles.item}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </div>
                            <div className={styles.details}>
                                <h2>{item.title}</h2>
                                <p>
                                    Cor escolhida: <strong>{item.color}</strong>
                                </p>

                                <label htmlFor={`qty-${item.id}`}>Quantidade:</label>
                                <input
                                    id={`qty-${item.id}`}
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                    className={styles.qtyInput}
                                />

                                <p>Preço unit.: R$ {item.price}</p>
                                <p>Subtotal: R$ {item.price * item.quantity}</p>

                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                                    Remover
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.summary}>
                    <h2>Total: R$ {getTotal()}</h2>
                    <div className={styles.actions}>
                        <Link href="/checkout">
                            <button className={styles.checkoutBtn}>Ir para Checkout</button>
                        </Link>
                        <button className={styles.clearBtn} onClick={clearCart}>
                            Limpar Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
