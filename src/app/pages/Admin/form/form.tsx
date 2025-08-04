'use client';

import styles from './form.module.css';
import { useState } from 'react';
import Link from 'next/link';
import LineMenu from './LineMenu/LineMenu';
import BoxMenu from './BoxMenu/BoxForm';
import Slides from './Slides/Slides';

type ComponentOption = 'line' | 'box' | 'slides' | null;

export default function Form() {
    const [activeComponent, setActiveComponent] = useState<ComponentOption>(null);
    const [isBoxFormOpen, setIsBoxFormOpen] = useState(false);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'line':
                return <LineMenu />;
            case 'slides':
                return <Slides />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.topSide}>
                    <h1>O que você deseja fazer?</h1>
                </div>
                <div className={styles.downSide}>
                    <div className={styles.leftSide}>
                        <ul className={styles.optionsList}>
                            <li>
                                <h4>Ver recibos</h4>
                                <Link href="/pages/Admin/purchases">
                                    <button>➔</button>
                                </Link>
                            </li>
                            <li>
                                <h4>Caixa de Items</h4>
                                <button onClick={() => setIsBoxFormOpen(true)}>➔</button>
                            </li>
                            {/*  <li>
                                <h4>Linha de Items</h4>
                                <button onClick={() => setActiveComponent('line')}>➔</button>
                            </li>
                            <li>
                                <h4>Editar Slides</h4>
                                <button onClick={() => setActiveComponent('slides')}>➔</button>
                            </li> */}
                        </ul>
                    </div>
                    <div className={styles.rightSide}>
                        {renderComponent()}
                        <BoxMenu isOpen={isBoxFormOpen} onClose={() => setIsBoxFormOpen(false)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
