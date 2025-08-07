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
    selected: boolean;
}
interface CartContextType {
    cart: CartItem[];
    retiradaNaLoja: boolean; // ✅ novo
    setRetiradaNaLoja: (value: boolean) => void; // ✅ novo
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, color: string) => void;
    updateQuantity: (id: string, color: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    toggleSelectItem: (id: string, color: string) => void;
    getSelectedItems: () => CartItem[];
    getSelectedTotal: () => number;
    getSelectedTotalWithFee: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [retiradaNaLoja, setRetiradaNaLoja] = useState(false);

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
            item.selected = false;
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

    const toggleSelectItem = (id: string, color: string) => {
        setCart((prev) =>
            prev.map((item) => (item.id === id && item.color === color ? { ...item, selected: !item.selected } : item))
        );
    };

    const getSelectedItems = () => cart.filter((item) => item.selected);

    const getSelectedTotal = () =>
        cart.reduce((sum, item) => (item.selected ? sum + item.price * item.quantity : sum), 0);

    const getSelectedTotalWithFee = () => {
        const selectedTotal = getSelectedTotal();
        const taxa = retiradaNaLoja ? 0 : 2.5;
        return selectedTotal > 0 ? selectedTotal + taxa : 0;
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                retiradaNaLoja,
                setRetiradaNaLoja,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotal,
                toggleSelectItem,
                getSelectedItems,
                getSelectedTotal,
                getSelectedTotalWithFee,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
