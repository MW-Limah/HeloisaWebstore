'use client';

import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';

export default function Main() {
    return (
        <main className={styles.Main} id="griditems">
            <div className={styles.content}>
                <BoxMenu />
            </div>
        </main>
    );
}
