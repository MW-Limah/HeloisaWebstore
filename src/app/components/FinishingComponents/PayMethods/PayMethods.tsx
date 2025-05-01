import styles from './PayMethods.module.css';
import Image from 'next/image';

export default function PayMethods() {
    return (
        <div className={styles.PayMethods}>
            <div className={styles.content}>
                <h3>Métodos de pagamento</h3>
                <p className={styles.Subtitle}>Como você prefere continuar?</p>
                <div className={styles.methodRow}>
                    <div className={styles.SelectWrapper}>
                        <select>
                            <option value="pix">Pix</option>
                            <option value="paypal">PayPal</option>
                            <option value="card">Cartão Crédito/Débito</option>
                        </select>
                    </div>

                    {/* <div className={styles.dinamicPayment}> Aqui será injetado o formulário dinâmico </div>*/}
                </div>
            </div>
            <div className={styles.bottom}>
                <Image width={25} height={25} alt="MasterCard Icone" src="/images/icons/mastercard.png" />
                <Image width={25} height={25} alt="PayPal Icone" src="/images/icons/paypal.png" />
                <Image width={25} height={25} alt="Pix Icone" src="/images/icons/pix.png" />
            </div>
        </div>
    );
}
