'use client';

import styles from './ThemeFilter.module.css';
import { useRouter } from 'next/navigation';

interface Theme {
    id: string;
    label: string;
}

const themes: Theme[] = [
    { id: 'homestuffs', label: 'Casa e decoração' },
    { id: 'eletronicos', label: 'Eletrônicos' },
    { id: 'lacos', label: 'Laços' },
    { id: 'maquiagens', label: 'Maquiagem' },
    { id: 'aneis', label: 'Anéis' },
    { id: 'cordoes', label: 'Cordões' },
    { id: 'brincos', label: 'Brincos' },
    { id: 'piranhas', label: 'Piranhas' },
    { id: '', label: 'Todos' },
];

interface ThemeFilterProps {
    onSelectTheme: (themeId: string) => void;
}

export default function ThemeFilter({ onSelectTheme }: ThemeFilterProps) {
    const router = useRouter();

    const handleClick = (id: string) => {
        onSelectTheme(id);

        if (typeof window !== 'undefined') {
            if (id) {
                // seta o hash normalmente
                window.location.hash = id;
            } else {
                // limpa hash
                history.replaceState(null, '', window.location.pathname + window.location.search);

                // ✅ força revalidação dos componentes (Next)
                router.refresh();

                // ✅ e notifica quem ouve hash (mesmo sem hash ter “mudado”)
                setTimeout(() => {
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                }, 0);
            }
        }
    };

    return (
        <aside className={styles.filter}>
            <h3>Filtrar por Tema</h3>
            <ul>
                {themes.map((theme) => (
                    <li key={theme.id}>
                        <button onClick={() => handleClick(theme.id)}>{theme.label}</button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
