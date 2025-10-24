'use client';
import AuthSessionProvider from './SessionProvider';
import { AuthProvider } from './providers/AuthProvider';
import { CartProvider } from './components/Cart/CartContext';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthSessionProvider>
            <AuthProvider>
                <CartProvider>{children}</CartProvider>
            </AuthProvider>
        </AuthSessionProvider>
    );
}
