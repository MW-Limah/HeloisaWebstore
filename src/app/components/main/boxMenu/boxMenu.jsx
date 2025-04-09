import styles from './boxMenu.module.css';
import Image from 'next/image';

export default function BoxMenu() {
    return (
        <article className={styles.boxContent}>
            <div className={styles.boxMenutitle}>
                <h2>Make</h2>
            </div>
            <div className={styles.boxMenu}>
                <div className={styles.boxItem}>
                    <Image
                        src={'/images/boxitemImg/batom.png'}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        alt="Batom Matte"
                    />
                </div>
                <div className={styles.boxItem}>
                    <Image
                        src={'/images/boxitemImg/esponjas.png'}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        alt="Esponja de base"
                    />
                </div>
                <div className={styles.boxItem}>
                    <Image
                        src={'/images/boxitemImg/pente.jpg'}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        alt="Pente com espelho embutido"
                    />
                </div>
                <div className={styles.boxItem}>
                    <Image
                        src={'/images/boxitemImg/pinceis.png'}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        alt="Pinceis de maquiagem"
                    />
                </div>
            </div>
        </article>
    );
}
