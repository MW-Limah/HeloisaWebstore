import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import LineMenu from './lineMenu/lineMenu';

export default function Main() {
    return (
        <main className={styles.Main}>
            <div className={styles.boxContent}>
                <BoxMenu />
            </div>
            {/* Div que irá receber o boxItem */}
            <div className={styles.lineContent}>
                {/* <LineMenu id="Brincos" /> */}
                <LineMenu id="Piranhas" />
                {/* <LineMenu id="Maquiagens" />
                <LineMenu id="Pulseiras" />
                <LineMenu id="Aneis" /> */}
            </div>
            <h3 style={{ color: 'black', position: 'relative', top: '-180px' }}>Toque na tulipaaa</h3>
            {/* Div que irá receber o lineItem */}
        </main>
    );
}
