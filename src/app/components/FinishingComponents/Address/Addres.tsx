import styles from './Address.module.css';

export default function Address() {
    return (
        <div className={styles.Address}>
            <h3>Endereço de entrega</h3>
            <form className={styles.FormContent}>
                <input type="text" placeholder="Digite seu CEP*" />

                <h4 className={styles.SectionTitle}>Resumo do Endereço</h4>
                <div className={styles.AddressGrid}>
                    <div className={styles.FieldGroup}>
                        <label>Bairro</label>
                        <input type="text" />
                    </div>
                    <div className={styles.FieldGroup}>
                        <label>Rua</label>
                        <input type="text" />
                    </div>
                    <div className={styles.FieldGroup}>
                        <label>Nº da Casa</label>
                        <input type="text" />
                    </div>
                </div>

                <p className={styles.Note}>No momento, fazemos entregas apenas em Manaus-AM.</p>
                <button className={styles.Button}>Confirmar endereço</button>
            </form>
        </div>
    );
}
