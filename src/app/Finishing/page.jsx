import styles from './Finishing.module.css';
import { InfoPersonal } from '../components/FinishingComponents/InfoPersonal/InfoPersonal';
import Address from '../components/FinishingComponents/Address/Addres';
import PayMethods from '../components/FinishingComponents/PayMethods/PayMethods';

export default function Finishing() {
    return (
        <div className={styles.container}>
            <h1>Finalizar compra</h1>
            <p>Preencha os campos abaixo, depois clique em finalizar compra ✨</p>
            <div className={styles.content}>
                <div>
                    <InfoPersonal />
                    <Address />
                    <PayMethods />
                </div>
                <div></div>
            </div>
        </div>
    );
}
