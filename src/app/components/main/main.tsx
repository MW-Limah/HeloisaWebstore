'use client';

import styles from './main.module.css';
import BoxMenu from './boxMenu/BoxItem';
import LatestReleases from '../LatestReleases/LatestReleases';
import ThemeFilter from '../ThemeFilter/ThemeFilter';

export default function Main() {
    return (
        <main className={styles.Main} id="griditems">
            <div className={styles.content}>
                <LatestReleases />
                <ThemeFilter
                    onSelectTheme={(themeId) => {
                        console.log('Tema selecionado no Header:', themeId);
                    }}
                />
                <BoxMenu />
            </div>
        </main>
    );
}
