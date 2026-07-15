'use client'

import { createContext, useContext, useEffect, useState } from "react";


export type CartItem = {variantId: string; quantity: number };

type CartContextValue = {
    items: CartItem[];
    addItem: (variantId: string, quantity?: number) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clear: () => void;
    totalCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'arowa_cart';

export function CartProvider ({children} : {children: React.ReactNode} ) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if(stored) {
            try{
                setItems(JSON.parse(stored));
            } catch {
                // corrupt value
            }
        }
        setHydrated(true);
    }, []);

    useEffect(() =>{
        if(!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    function addItem(variantId: string, quantity = 1) {
        setItems((prev) => {
            const existing = prev.find((i) => i.variantId === variantId);
            if (existing) {
            return prev.map((i) =>
                i.variantId === variantId
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
            );
            }
            return [...prev, { variantId, quantity }];
        });
    }

    function removeItem(variantId: string) {
            setItems((prev) => prev.filter((i) => i.variantId != variantId));
    }

    function updateQuantity(variantId: string, quantity: number) {
        if(quantity <= 0) {
            removeItem(variantId);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.variantId === variantId ? {...i, quantity} : i)) 
        );
    }

    function clear() {
        setItems([]);
    }
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return(
        <CartContext
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clear,totalCount
            }}
        >
            {children}
        </CartContext>
    );
}

export function useCart(){
    const ctx = useContext(CartContext);

    if(!ctx) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return ctx;
}