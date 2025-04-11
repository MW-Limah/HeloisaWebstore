import styles from './form.module.css';

export default function Form() {
    return (
        <div className={styles.container}>
            <div className={styles.topSide}>
                <h1>O que você deseja fazer?</h1>
            </div>
            <div className={styles.downSide}>
                <div className={styles.leftSide}>
                    <ul className={styles.ul1}>
                        <li>
                            <h4>Caixa de Items</h4>
                        </li>
                        <li>
                            <h4>Linha de Items</h4>
                        </li>
                        <li>
                            <h4>Editar Slides</h4>
                        </li>
                    </ul>
                    <ul className={styles.ul2}>
                        <li>
                            <button>➔</button>
                        </li>
                        <li>
                            <button>➔</button>
                        </li>
                        <li>
                            <button>➔</button>
                        </li>
                    </ul>
                </div>
                <div className={styles.rightSide}></div>
            </div>
        </div>
    );
}
