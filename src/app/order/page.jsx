import styles from './order.module.css';
import style from './order.module.css';
import JustTop from '../components/nav/justTop';
import Image from 'next/image';

export default function OrderPage() {
    return (
        <div className={styles.container}>
            <JustTop />
            <div className={styles.content}>
                <div className={styles.Details}>
                    <div className={styles.details}>
                        <h2>Quero encomendar esse produto</h2>
                        <div className={styles.info}>
                            <label htmlFor="">Produto: </label>
                            <input type="text" readOnly />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Código: </label>
                            <input type="text" readOnly />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Quantidade: </label>
                            <input type="text" readOnly />
                        </div>
                        <div className={styles.info}>
                            <label htmlFor="">Cor: </label>
                            <input type="text" readOnly />
                        </div>
                        <div className={styles.imgWrapper}>
                            <Image
                                src="/Hlogo.png"
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
                            <input type="number" placeholder="Telefone" />
                        </div>
                        <div className={styles.clientMsg}>
                            <label htmlFor="">Mensagem: </label>
                            <textarea name="" id=""></textarea>
                            <p>Por favor, seja educado.</p>
                        </div>
                    </div>
                </div>
                <span className={styles.notice}>
                    Ao encomendar um projeto, você estará entrando em contato direto com a proprietária.
                </span>
            </div>
        </div>
    );
}
