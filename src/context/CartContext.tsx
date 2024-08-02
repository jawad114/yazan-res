// CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
    cartItems: string[]; // Change string[] to your actual item type
    addToCart: (item: string) => void; // Change string to your actual item type
    removeFromCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<string[]>([]); // Change string[] to your actual item type

    const addToCart = (item: string) => {
        setCartItems([...cartItems, item]);
    };

    const removeFromCart = () => {
        if (cartItems.length > 0) {
            const updatedCartItems = cartItems.slice(0, -1);
            setCartItems(updatedCartItems);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
