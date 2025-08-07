import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import LineMenu from './lineMenu/lineMenu';
import HomeStuffs from './homeStuffs/homeStuffs';

export default function Main() {
    return (
        <main className={styles.Main}>
            <BoxMenu />
            <HomeStuffs />
        </main>
    );
}
