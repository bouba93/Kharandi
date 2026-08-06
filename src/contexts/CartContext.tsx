import React, { createContext, useContext, useState } from 'react';

interface ProductVariant {
  name: string;
  options: string[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  sellerId: string;
  imageUrl?: string;
  variants?: ProductVariant[];
  selectedVariants?: Record<string, string>;
}

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  sellerId: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  promoCode: PromoCode | null;
  applyPromoCode: (promo: PromoCode | null) => void;
}

const CartContext = createContext<CartContextType>({ 
  cart: [], 
  addToCart: () => {}, 
  removeFromCart: () => {},
  clearCart: () => {},
  promoCode: null,
  applyPromoCode: () => {}
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);

  const addToCart = (product: Product) => setCart(prev => [...prev, product]);
  const removeFromCart = (productId: string, selectedVariants?: Record<string, string>) => {
    setCart(prev => {
      const index = prev.findIndex(p => {
        if (p.id !== productId) return false;
        if (!selectedVariants && !p.selectedVariants) return true;
        if (selectedVariants && p.selectedVariants) {
          return JSON.stringify(selectedVariants) === JSON.stringify(p.selectedVariants);
        }
        return false;
      });
      if (index > -1) {
        const newCart = [...prev];
        newCart.splice(index, 1);
        return newCart;
      }
      return prev;
    });
  };
  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
  };
  const applyPromoCode = (promo: PromoCode | null) => setPromoCode(promo);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, promoCode, applyPromoCode }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
