'use client';

import { useState } from 'react';
import styles from './checkout.module.css';
import JustTop from '@/app/components/nav/justTop';
import Image from 'next/image';

export default function CheckOut() {
    const [highlighted, setHighlighted] = useState('/images/lineMenu/itens/item9.jpg');
    const [thumbnails, setThumbnails] = useState([
        '/images/lineMenu/itens/item1.jpg',
        '/images/lineMenu/itens/item2.jpg',
        '/images/lineMenu/itens/item3.jpg',
    ]);

    const handleImageClick = (clickedImage: string, index: number) => {
        const newThumbnails = [...thumbnails];
        newThumbnails[index] = highlighted; // Coloca a imagem em foco no lugar da clicada
        setHighlighted(clickedImage); // Atualiza o foco com a clicada
        setThumbnails(newThumbnails); // Atualiza o array lateral
    };

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.leftSide}>
                    <div className={styles.gridImages}>
                        <div className={styles.sideImages}>
                            {thumbnails.map((src, index) => (
                                <Image
                                    key={index}
                                    src={src}
                                    width={148}
                                    height={148}
                                    alt={`Imagem ${index + 1}`}
                                    onClick={() => handleImageClick(src, index)}
                                    style={{
                                        cursor: 'pointer',
                                        border: src === highlighted ? '2px solid #333' : 'none',
                                        transition: 'transform 0.2s ease',
                                    }}
                                />
                            ))}
                        </div>
                        <div className={styles.imageFocused}>
                            <Image src={highlighted} width={500} height={500} alt="Imagem em destaque" />
                        </div>
                    </div>

                    <div className={styles.commentsT}>
                        <h2>Comentários</h2>
                    </div>
                    <div className={styles.comments}>
                        <h3>Pessoa 1</h3>
                        <p>este produto é incrível!</p>
                        <h3>Pessoa 2</h3>
                        <p>este produto é incrível!</p>
                        <h3>Pessoa 3</h3>
                        <p>este produto é incrível!</p>
                        <h3>Pessoa 4</h3>
                        <p>este produto é incrível!</p>
                        <h3>Pessoa 4</h3>
                        <p>este produto é incrível!</p>
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <form className={styles.checkoutForm}>
                        <h2>Check-out</h2>

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
                                    <label htmlFor="quantity">Em estoque</label>
                                    <select id="quantity" name="quantity" defaultValue="1">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>

                                <div className={styles.finishItem}>
                                    <label htmlFor="color">Cor</label>
                                    <select id="color" name="color" defaultValue="verde">
                                        <option value="verde">Verde</option>
                                        <option value="vermelho">Vermelho</option>
                                        <option value="azul">Azul</option>
                                        <option value="preto">Preto</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.bottomFinish}>
                                <h3 className={styles.price}>R$ 22,00</h3>
                                <p>20,00 + 2,00 (entrega)</p>
                                <button type="submit" className={styles.buttonFinish}>
                                    Finalizar compra
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
