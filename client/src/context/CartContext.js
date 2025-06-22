import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
  const deduplicated = cartItems.reduce((acc, item) => {
    const existing = acc.find((x) => x._id === item._id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  localStorage.setItem('cartItems', JSON.stringify(deduplicated));
}, [cartItems]);


  const addToCart = (item) => {
    const exist = cartItems.find((x) => x._id === item._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === item._id ? { ...x, qty: x.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
  if (qty < 1) {
    removeFromCart(id);
    return;
  }

  setCartItems(
    cartItems.map((item) =>
      item._id === id ? { ...item, qty } : item
    )
  );
};

const clearCart = () => {
  setCartItems([]);
};


  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty , clearCart}}
    >
      {children}
    </CartContext.Provider>
  );
};

