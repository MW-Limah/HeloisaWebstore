import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Fontes
const geistSans = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
});

// Metadados da página
export const metadata = {
    title: 'Heloisa Moda Feminina',
    description: 'Loja virtual, ecommerce, Heloisa Moda Feminina, moda feminina, acessórios para mulheres',
    icons: {
        icon: '/favicon.png',
    },
};

// Layout principal
export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
        </html>
    );
}
