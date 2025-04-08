import styles from './boxMenu.module.css';

export default function BoxMenu() {
    return (
        <article className={styles.boxContent}>
            <div className={styles.boxMenutitle}>
                <h2>Make</h2>
            </div>
            <div className={styles.boxMenu}>
                <div className={styles.boxItem}>1</div>
                <div className={styles.boxItem}>1</div>
                <div className={styles.boxItem}>1</div>
                <div className={styles.boxItem}>1</div>
            </div>
        </article>
    );
}
