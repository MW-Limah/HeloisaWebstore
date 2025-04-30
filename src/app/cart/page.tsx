'use client';

import JustTop from '../components/nav/justTop';
import { useCart } from '@/app/components/Cart/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './cart.module.css';
import { TbShoppingCartCopy } from 'react-icons/tb';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className={styles.empty}>
                <h1>Seu carrinho está vazio 😢</h1>
                <Link href="/">
                    Continuar comprando <TbShoppingCartCopy />
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <ul className={styles.list}>
                    {cart.map((item) => {
                        const colorImage =
                            item.images.find((img) => img.toLowerCase().includes(item.color.toLowerCase())) ||
                            item.image;

                        return (
                            <li key={`${item.id}-${item.color}`} className={styles.item}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={colorImage}
                                        alt={item.title}
                                        width={150}
                                        height={150}
                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <div>
                                        <h2>{item.title}</h2>
                                        <p>
                                            Cor escolhida: <strong>{item.color}</strong>
                                        </p>
                                        <label htmlFor={`qty-${item.id}-${item.color}`}>Quantidade:</label>
                                        <input
                                            id={`qty-${item.id}-${item.color}`}
                                            type="number"
                                            min={1}
                                            max={item.maxQuantity}
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const value = Math.min(Number(e.target.value), item.maxQuantity);
                                                updateQuantity(item.id, item.color, value);
                                            }}
                                            className={styles.qtyInput}
                                        />
                                        <p>
                                            Preço unit.: <strong>R$ {item.price}</strong>
                                        </p>
                                        <p>
                                            Subtotal: <strong>R$ {item.price * item.quantity}</strong>
                                        </p>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.id, item.color)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className={styles.summary}>
                    <h2>Total: R$ {getTotal()}</h2>
                    <div className={styles.actions}>
                        <Link href="/Finishing">
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
