import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('jbn_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jbn_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cake, quantity = 1) => {
    // Each quantity unit represents 250g.
    // Minimum weight is 500g (which is 2 units).
    // Adding to cart adds 500g (2 units) if not exists, and 250g (1 unit) if already exists.
    const unitPrice250g = cake.price * 0.5;

    setCartItems(prev => {
      const existing = prev.find(item => item.cakeId === cake.id);
      if (existing) {
        return prev.map(item => 
          item.cakeId === cake.id 
            ? { ...item, quantity: item.quantity + 1 } // Add 250g (1 unit) on subsequent clicks
            : item
        );
      }
      return [...prev, {
        id: cake.id,
        cakeId: cake.id,
        name: cake.name,
        price: unitPrice250g, // Base price of a 250g portion
        basePrice: cake.price, // Original 500g price for reference
        imageUrl: cake.imageUrl,
        quantity: 2 // Start with 500g (2 units of 250g)
      }];
    });
  };

  const removeFromCart = (cakeId) => {
    setCartItems(prev => prev.filter(item => item.cakeId !== cakeId));
  };

  const updateQuantity = (cakeId, quantity) => {
    // If quantity goes below 2 (500g minimum weight), remove it from the cart
    if (quantity < 2) return removeFromCart(cakeId);
    
    setCartItems(prev => prev.map(item => 
      item.cakeId === cakeId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
