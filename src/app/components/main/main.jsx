import styles from './main.module.css';

export default function Main() {
    return (
        <main className={styles.Main}>
            <div className={styles.boxContent}>Conteudo</div> {/* Div que irá receber o boxItem */}
            <div className={styles.lineContent}></div> {/* Div que irá receber o lineItem */}
        </main>
    );
}
