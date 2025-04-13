// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart from localStorage:", e);
      }
    }
  }, []);
  
  //Spara cart i localStorage när den ändras
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Kolla om prodcten finns 
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Produkten finns, öka kvantiteten
        const updatedItems = [...prevItems];
        const currentQuantity = updatedItems[existingItemIndex].quantity || 1;
        updatedItems[existingItemIndex].quantity = currentQuantity + 1;
        return updatedItems;
      } else {
        // Produkten finns inte, lägg till den
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };
  
  const updateQuantity = (index, quantity) => {
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = quantity;
      return updatedItems;
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
