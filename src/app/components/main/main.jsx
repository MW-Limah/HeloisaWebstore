import styles from './main.module.css';
import BoxMenu from './boxMenu/boxMenu';

export default function Main() {
    return (
        <main className={styles.Main}>
            <div className={styles.boxContent}>
                <BoxMenu />
                <BoxMenu />
                <BoxMenu />
                <BoxMenu />
            </div>
            {/* Div que irá receber o boxItem */}
            <div className={styles.lineContent}></div> {/* Div que irá receber o lineItem */}
        </main>
    );
}
