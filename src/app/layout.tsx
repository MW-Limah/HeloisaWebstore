import { Geist, Geist_Mono, Jost } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/app/ClienteProviders';

const geistSans = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
});

const jost = Jost({
    subsets: ['latin'],
    variable: '--font-jost',
    display: 'swap',
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
});

// ✅ Permanece aqui, sem erro
export const metadata = {
    title: 'Heloisa Moda Feminina',
    description: 'Loja virtual, ecommerce, Heloisa Moda Feminina, moda feminina, acessórios para mulheres',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
