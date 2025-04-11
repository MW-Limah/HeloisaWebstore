import styles from './form.module.css';

export default function Form() {
    return (
        <div className={styles.container}>
            <div className={styles.LeftSide}>
                <h2>O que você quer fazer?</h2>
                <ul>
                    <li>
                        <h4>Caixa de Items</h4>
                        <button>{'->'}</button>
                    </li>
                    <li>
                        <h4>Linha de Items</h4>
                        <button>{'->'}</button>
                    </li>
                    <li>
                        <h4>Slide</h4>
                        <button>{'->'}</button>
                    </li>
                </ul>
            </div>
            <div className={styles.RightSide}></div>
        </div>
    );
}
