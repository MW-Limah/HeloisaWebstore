'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string; // imagem principal
    images: string[]; // ✅ nova propriedade: todas as imagens disponíveis
    quantity: number;
    color: string;
    maxQuantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, color: string) => void;
    updateQuantity: (id: string, color: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) setCart(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id && i.color === item.color);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id && i.color === item.color
                        ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxQuantity) }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string, color: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.color === color)));
    };

    const updateQuantity = (id: string, color: string, quantity: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.color === color
                    ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                    : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
