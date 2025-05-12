import styles from './buttonBack.module.css';
import { TbArrowBackUp } from 'react-icons/tb';
import Link from 'next/link';

export default function ButtonBack() {
    return (
        <Link href={'/'} className={styles.back}>
            <div className={styles.buttonBack}>
                Voltar ao início <TbArrowBackUp />
            </div>
        </Link>
    );
}
