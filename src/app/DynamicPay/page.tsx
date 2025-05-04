import styles from './DynamicPay.module.css';

export default function DynamicPay() {
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                {/* Vamos adicionar os layouts dinâmicos do QR-Pix, Cartão e Boleto aqui */}
            </div>
        </div>
    );
}
