import styles from './main.module.css';
import BoxMenu from './boxMenu/boxMenu';
import LineMenu from './lineMenu/lineMenu';

export default function Main() {
    return (
        <main className={styles.Main}>
            <div className={styles.boxContent}>
                <BoxMenu />
                <BoxMenu />
                <BoxMenu />
            </div>
            {/* Div que irá receber o boxItem */}
            <div className={styles.lineContent}>
                <LineMenu />
            </div>
            {/* Div que irá receber o lineItem */}
        </main>
    );
}
