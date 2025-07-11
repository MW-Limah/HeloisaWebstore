'use client';

import styles from './order.module.css';
import JustTop from '../components/nav/justTop';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function OrderPage() {
    const searchParams = useSearchParams();

    const id = searchParams.get('id') || '';
    const title = searchParams.get('title') || '';
    const price = searchParams.get('price') || '';
    const image = searchParams.get('image') || '/Hlogo.png';
    const quantity = searchParams.get('quantity') || '';
    const color = searchParams.get('color') || '';

    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.Details}>
                    <div className={styles.details}>
                        <h2>Quero encomendar esse produto</h2>

                        <div className={styles.info}>
                            <label htmlFor="">Produto: </label>
                            <input type="text" readOnly value={title} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Código: </label>
                            <input type="text" readOnly value={id} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Quantidade: </label>
                            <input type="text" readOnly value={quantity} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Cor: </label>
                            <input type="text" readOnly value={color} />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Valor: </label>
                            <input type="text" readOnly value={`R$ ${Number(price).toFixed(2).replace('.', ',')}`} />
                        </div>

                        <div className={styles.imgWrapper}>
                            <Image
                                src={image}
                                alt="Imagem do produto"
                                width={200}
                                height={200}
                                className={styles.productImage}
                            />
                        </div>
                    </div>

                    <div className={styles.clientDetails}>
                        <h2>Detalhes do cliente</h2>
                        <div className={styles.clientInfo}>
                            <input type="text" placeholder="Nome" />
                        </div>
                        <div className={styles.clientInfo}>
                            <input type="text" placeholder="Sobrenome" />
                        </div>
                        <div className={styles.clientInfo}>
                            <input type="email" placeholder="E-mail" />
                        </div>
                        <div className={styles.clientInfo}>
                            <input type="tel" placeholder="Telefone" />
                        </div>
                        <div className={styles.clientMsg}>
                            <label htmlFor="">Mensagem: </label>
                            <textarea placeholder="Digite sua mensagem aqui" />
                            <p>Por favor, seja educado.</p>
                        </div>
                    </div>
                </div>
            </div>
            <span className={styles.notice}>
                Ao encomendar um projeto, você estará entrando em contato direto com a proprietária.
            </span>
        </div>
    );
}
