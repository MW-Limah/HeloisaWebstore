import { Geist, Geist_Mono, Urbanist, Merriweather_Sans } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/app/ClienteProviders';

const geistSans = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
});

const Merriweather = Merriweather_Sans({
    subsets: ['latin'],
    variable: '--merriweather',
    display: 'swap',
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
});

const urbanist = Urbanist({
    subsets: ['latin'],
    variable: '--font-urbanist',
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
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${Merriweather.variable} ${urbanist.variable}`}
            >
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    );
}
