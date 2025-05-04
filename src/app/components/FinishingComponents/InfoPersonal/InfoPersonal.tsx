'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';

export const InfoPersonal = () => {
    return (
        <div className={styles.InfoPersonal}>
            <div className={styles.content}>
                <h3>Informações pessoais</h3>
                <ul className={styles.InfoList}>
                    <li>
                        Para saber mais sobre o uso de dados <Link href="/termos-de-uso">clique aqui.</Link>
                    </li>
                </ul>

                <form className={styles.ContentForm}>
                    <div>
                        <input type="email" placeholder="E-mail*" />
                    </div>
                    <div className={styles.NameInputs}>
                        <input type="text" placeholder="Nome*" />
                        <input type="text" placeholder="Sobrenome*" />
                    </div>
                    <div>
                        <input type="tel" placeholder="Telefone*" />
                    </div>
                    <p>Esses dados serão usados apenas para processar entregas.</p>
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
