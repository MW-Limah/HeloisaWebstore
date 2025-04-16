import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import LineMenu from './lineMenu/lineMenu';

export default function Main() {
    return (
        <main className={styles.Main}>
            <BoxMenu />

            {/* <div className={styles.lineContent}>
                <LineMenu id="Piranhas" />
            </div> */}
        </main>
    );
}
