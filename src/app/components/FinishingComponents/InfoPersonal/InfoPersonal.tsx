'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';

export const InfoPersonal = () => {
    return (
        <div className={styles.InfoPersonal}>
            <div className={styles.content}>
                <h3>Informações pessoais</h3>
                <ul className={styles.InfoList}>
                    <li>Para quem vou enviar esse pedido?</li>
                    <li>
                        Para saber mais sobre o uso de dados <Link href="/termos-de-uso">clique aqui.</Link>
                    </li>
                </ul>

                <form className={styles.ContentForm}>
                    <div>
                        <input type="email" placeholder="E-mail para confirmação*" />
                    </div>
                    <div className={styles.NameInputs}>
                        <input type="text" placeholder="Primeiro nome*" />
                        <input type="text" placeholder="Segundo nome*" />
                    </div>
                    <div>
                        <input type="tel" placeholder="Telefone para confirmação" />
                    </div>
                    <p>Nenhum desses dados serão usados senão para fazer essa entrega.</p>
                </form>
            </div>

            <div className={styles.Bottom}>
                <p>
                    Já tem um cadastro? <Link href="#">Clique aqui</Link>. Isso agiliza o checkout!
                </p>
            </div>
        </div>
    );
};
