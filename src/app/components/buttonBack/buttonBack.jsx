import styles from './buttonBack.module.css';
import { TbArrowBackUp } from 'react-icons/tb';
import Link from 'next/link';

export default function ButtonBack() {
    return (
        <div className={styles.buttonBack}>
            <Link href={'/'} className={styles.back}>
                Voltar ao início <TbArrowBackUp />
            </Link>
        </div>
    );
}
