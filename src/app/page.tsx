//app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Navbar from './components/navbar/navbar';
import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

export default function Home() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        fetch(`/api/visits?t=${Date.now()}`, {
            cache: 'no-store',
            next: { revalidate: 0 },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('🛰️ /api/visits retornou:', data);
                setVisits(data.count);
            })
            .catch((err) => console.error('Erro ao buscar visitas', err));
    }, []);

    return (
        <>
            <div className={styles.visitsContainer}>
                <p>Visitas: {visits ?? '...'}</p>
            </div>
            <Navbar />
            <Header />
            <Main />
            <Footer />
        </>
    );
}
