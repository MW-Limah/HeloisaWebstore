import styles from './CheckoutForm.module.css';

export default function CheckoutForm() {
    return (
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
                        <label className={styles.labell} htmlFor="quantity">
                            Em estoque
                        </label>
                        <select id="quantity" name="quantity" defaultValue="1">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.finishItem}>
                        <label htmlFor="color">Cor</label>
                        <select id="color" name="color" defaultValue="verde">
                            {['verde', 'vermelho', 'azul', 'preto'].map((cor) => (
                                <option key={cor} value={cor}>
                                    {cor}
                                </option>
                            ))}
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
    );
}
