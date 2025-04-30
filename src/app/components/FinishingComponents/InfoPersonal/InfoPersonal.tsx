'use client';

import styles from './InfoPersonal.module.css';
import Link from 'next/link';

export const InfoPersonal = () => {
    return (
        <div className={styles.infoPersonal}>
            <div className={styles.TopTexts}>
                <div className={styles.RightSide}>
                    <h3>Informações pessoais</h3>
                </div>
                <div className={styles.LeftSide}>
                    <p>Para quem eu envio esse pedido?</p>
                    <p>
                        Se quiser saber mais sobre o uso de dados <Link href={'/termos-de-uso'}>clique aqui.</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
