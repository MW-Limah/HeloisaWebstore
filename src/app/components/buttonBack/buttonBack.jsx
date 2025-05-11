'use client';
import styles from './buttonBack.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';

export default function ButtonBack() {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/'); // fallback para home se não houver página anterior
        }
    };

    return (
        <div className={styles.buttonBack}>
            <button onClick={handleBack} className={styles.back}>
                Voltar página <IoMdArrowRoundBack />
            </button>
        </div>
    );
}
