'use client';

import { useSession, signOut } from 'next-auth/react';

export default function AdminPage() {
    const { data: session, status } = useSession();

    if (status === 'loading') return <p>Carregando...</p>;

    if (!session) return <p>Você não está autenticado.</p>;

    return (
        <main>
            <h1>Bem-vindo, {session.user.name}</h1>
            <button onClick={() => signOut()}>Sair</button>
            {/* Coloque aqui o conteúdo protegido */}
        </main>
    );
}
