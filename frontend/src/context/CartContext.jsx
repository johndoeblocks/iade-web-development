import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

/**
 * CartProvider - Provides cart state to the entire app
 * 
 * Usage:
 *   <CartProvider>
 *     <App />
 *   </CartProvider>
 * 
 *   const { cart, addToCart, removeFromCart, cartCount, cartTotal } = useCart();
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (pizza) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) {
        return prev.map(item =>
          item.id === pizza.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { ...pizza, quantidade: 1 }];
    });
  };

  const removeFromCart = (pizzaId) => {
    setCart(prev => prev.filter(item => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, quantidade) => {
    if (quantidade <= 0) {
      removeFromCart(pizzaId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === pizzaId ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantidade, 0);
  const cartTotal = cart.reduce((total, item) => total + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * useCart hook - Access cart state from any component
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
