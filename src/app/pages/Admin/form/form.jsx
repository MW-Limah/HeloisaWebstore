'use client';

import styles from './form.module.css';
import { useState } from 'react';
import LineMenu from './LineMenu/LineMenu';
import BoxMenu from './BoxMenu/BoxMenu';
import Slides from './Slides/Slides';

export default function Form() {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'line':
                return <LineMenu />;
            case 'box':
                return <BoxMenu />;
            case 'slides':
                return <Slides />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topSide}>
                <h1>O que você deseja fazer?</h1>
            </div>
            <div className={styles.downSide}>
                <div className={styles.leftSide}>
                    <ul className={styles.optionsList}>
                        <li>
                            <h4>Caixa de Items</h4>
                            <button onClick={() => setActiveComponent('box')}>➔</button>
                        </li>
                        <li>
                            <h4>Linha de Items</h4>
                            <button onClick={() => setActiveComponent('line')}>➔</button>
                        </li>
                        <li>
                            <h4>Editar Slides</h4>
                            <button onClick={() => setActiveComponent('slides')}>➔</button>
                        </li>
                    </ul>
                </div>
                <div className={styles.rightSide}>{renderComponent()}</div>
            </div>
        </div>
    );
}
