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
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const visited = document.cookie.includes('visited_home=true');
        const dismissed = localStorage.getItem('welcomeDismissed') === 'true';

        if (visited && !dismissed) {
            setShowWelcome(true);
        }
    }, []);

    const handleDismiss = () => {
        setShowWelcome(false);
        localStorage.setItem('welcomeDismissed', 'true');
    };

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
            {showWelcome && (
                <div className={styles.welcomeOverlay}>
                    <p>
                        Olá, bem-vindo! Dica: Em smartphones você pode usar a imagem para voltar ou as três barras para
                        navegar pelo site.
                    </p>
                    <button
                        onClick={handleDismiss}
                        style={{
                            marginTop: '0.5rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#365b6d',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Ok
                    </button>
                </div>
            )}
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
