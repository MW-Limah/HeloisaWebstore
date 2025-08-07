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
    const { getSelectedItems, getSelectedTotal, getSelectedTotalWithFee, retiradaNaLoja, setRetiradaNaLoja } =
        useCart();

    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const selectedItems = getSelectedItems();
    const selectedTotal = getSelectedTotal();
    const taxa = retiradaNaLoja ? 0 : 2.5;
    const valorTotalComTaxa = getSelectedTotalWithFee(); // ✅ usa o contexto central

    const handleFinish = () => {
        const checkoutData = {
            ...formData,
            total: valorTotalComTaxa,
            retiradaNaLoja,
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        router.push('/checkout/payment');
    };

    return (
        <div className={styles.ResumeCart}>
            <div className={styles.Content}>
                <h3 className={styles.cartTitle}>Conteúdo do carrinho</h3>

                <button className={styles.ViewCartBtn} onClick={() => setShowPopup(true)}>
                    Ver conteúdo do carrinho
                </button>

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
                                <p>R$ {retiradaNaLoja ? '0,00' : '2,50'}</p>
                            </li>
                        </ul>

                        <ul className={styles.priceTotal}>
                            <li>
                                <h4>TOTAL</h4>
                                <p>R$ {getSelectedTotalWithFee().toFixed(2).replace('.', ',')}</p>
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

                    {/* ✅ Checkbox de retirada na loja */}
                    <div className={styles.CheckboxRetirada}>
                        <input
                            type="checkbox"
                            id="retirada"
                            checked={retiradaNaLoja}
                            onChange={(e) => setRetiradaNaLoja(e.target.checked)}
                        />
                        <label htmlFor="retirada">Buscar produto na loja (sem taxa)</label>
                    </div>
                </div>

                <button className={styles.Button} onClick={handleFinish}>
                    Finalizar compra
                </button>
            </div>

            {/* Popup dos itens (sem alteração) */}
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
