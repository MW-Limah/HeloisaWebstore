import styles from './errorpage.module.css';
import ButtonBackAll from '../components/buttonBackAll/buttonBack';

export default function ErrorPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ops, temos um erro ou estamos atualizando essa página.</h1>
            <p className={styles.message}>
                Desculpe-nos, estamos trabalhando para resolver isso logo. Mas o que acha de reservar esse produto? 🫡
            </p>
            <div>
                <p className={styles.bye}>Por favor, volte mais tarde.</p>
                <ButtonBackAll />
            </div>
        </div>
    );
}
