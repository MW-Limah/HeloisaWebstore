// src/app/layout.tsx

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthSessionProvider from './SessionProvider';
import { CartProvider } from './components/Cart/CartContext'; // <-- importe o CartProvider
import { FormProvider } from './components/Checkout/CheckoutForm/FormContext';

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
};

// Layout principal
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <AuthSessionProvider>
                    <FormProvider>
                        <CartProvider>{children}</CartProvider>
                    </FormProvider>
                </AuthSessionProvider>
            </body>
        </html>
    );
}
