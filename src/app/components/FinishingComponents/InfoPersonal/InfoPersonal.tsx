'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';

export const InfoPersonal = () => {
    return (
        <div className={styles.InfoPersonal}>
            <div className={styles.ContentTitle}>
                <h3>Informações pessoais</h3>
                <ul>
                    <li>Para quem vou enviar esse pedido?</li>
                    <li>
                        Se quiser saber mais sobre o uso desse dados, <Link href={'/termos-de-uso'}>clique aqui.</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};
