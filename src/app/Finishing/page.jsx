import styles from './Finishing.module.css';
import { InfoPersonal } from '../components/FinishingComponents/InfoPersonal/InfoPersonal';

export default function Finishing() {
    return (
        <div className={styles.container}>
            <h1>Finalizar compra</h1>
            <p>Preencha os campos abaixo, depois clique em finalizar compra ✨</p>
            <div className={styles.content}>
                <InfoPersonal />
            </div>
        </div>
    );
}
