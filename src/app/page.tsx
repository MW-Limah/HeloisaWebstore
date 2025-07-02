//app/page.tsx

'use client';

import { useEffect, useState } from 'react';
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
            <div>
                <h1>Bem‑vindo ao meu site!</h1>
                <p>Esta página foi visitada {visits ?? '...'} vezes.</p>
            </div>
            <Navbar />
            <Header />
            <Main />
            <Footer />
        </>
    );
}
