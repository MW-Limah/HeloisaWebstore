// src/app/checkout/components/ResumeCart.tsx
'use client';

import { useCart } from '@/app/components/Cart/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResumeCart.module.css';
import Image from 'next/image';

export type ResumeCartProps = {
    formData: {
        email: string;
        nome: string;
        sobrenome: string;
        telefone: string;
        cep: string;
        bairro: string;
        rua: string;
        numero: string;
    };
    paymentMethod: 'pix' | 'boleto' | 'card';
    onFinish: () => void;
};

export default function ResumeCart({ formData, paymentMethod, onFinish }: ResumeCartProps) {
    const { getSelectedItems, getSelectedTotal } = useCart();
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const selectedItems = getSelectedItems();
    const selectedTotal = getSelectedTotal();

    const taxa = 5;
    const valorTotalComTaxa = selectedTotal + taxa;

    const handleFinish = () => {
        // Store the total amount in localStorage
        const checkoutData = {
            ...formData,
            total: valorTotalComTaxa,
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Navigate to payment page
        router.push('/checkout/payment');
    };

    return (
        <div className={styles.ResumeCart}>
            <div className={styles.Content}>
                {/* Título apenas em mobile */}
                <h3 className={styles.cartTitle}>Conteúdo do carrinho</h3>

                {/* Botão só em mobile */}
                <button className={styles.ViewCartBtn} onClick={() => setShowPopup(true)}>
                    Ver conteúdo do carrinho
                </button>

                {/* Itens normais (desktop) */}
                <div className={styles.itemsResume}>
                    {selectedItems.map((item) => (
                        <div key={`${item.id}-${item.color}`} className={styles.item}>
                            <Image width={100} height={100} src={item.image} alt={item.title} />
                            <div className={styles.itemInfo}>
                                <h3>{item.title}</h3>
                                <p>Cor: {item.color}</p>
                                <p>Qtd: {item.quantity}</p>
                                <p>Preço: R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sticky footer com detalhes e botão */}
                <div className={styles.priceDetails}>
                    <div className={styles.Details}>
                        <h3>Detalhes da compra</h3>
                        <ul className={styles.priceDetails}>
                            <li>
                                <h4>Subtotal</h4>
                                <p>R$ {selectedTotal.toFixed(2).replace('.', ',')}</p>
                            </li>
                            <li>
                                <h4>Taxa de entrega</h4>
                                <p>R$ 4,50</p>
                            </li>
                        </ul>

                        <ul className={styles.priceTotal}>
                            <li>
                                <h4>TOTAL</h4>
                                <p>R$ {(selectedTotal + 4.5).toFixed(2).replace('.', ',')}</p>
                            </li>
                            <li>
                                <h4>Método de Pagamento: </h4>
                                <p>
                                    {paymentMethod === 'pix' && 'PIX'}
                                    {paymentMethod === 'boleto' && 'Boleto Bancário'}
                                    {paymentMethod === 'card' && 'Cartão de Crédito'}
                                </p>
                            </li>
                        </ul>
                    </div>
                    <button className={styles.Button} onClick={handleFinish}>
                        Finalizar compra
                    </button>
                </div>
            </div>

            {/* Popup (sempre definido, mas só aparece quando showPopup=true) */}
            {showPopup && (
                <div className={styles.PopupOverlay} onClick={() => setShowPopup(false)}>
                    <div className={styles.Popup} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.CloseBtn} onClick={() => setShowPopup(false)}>
                            Fechar
                        </button>
                        <div className={styles.popupItemsResume}>
                            {selectedItems.map((item) => {
                                const colorImage =
                                    item.images.find((img) => img.toLowerCase().includes(item.color.toLowerCase())) ||
                                    item.image;
                                return (
                                    <div key={`${item.id}-${item.color}`} className={styles.item}>
                                        <div className={styles.imageWrapper}>
                                            <Image
                                                src={colorImage}
                                                alt={item.title}
                                                width={100}
                                                height={100}
                                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        </div>
                                        <div className={styles.itemDetails}>
                                            <h4>{item.title}</h4>
                                            <p>
                                                Cor escolhida: <strong>{item.color}</strong>
                                            </p>
                                            <p>
                                                Quantidade: <strong>{item.quantity}</strong>
                                            </p>
                                            <p>
                                                Preço unitário: <strong>R$ {item.price.toFixed(2)}</strong>
                                            </p>
                                            <p>
                                                Subtotal: <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
