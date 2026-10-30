import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext(null);
const STORAGE_KEY = "shubhdeep.cart.v1";

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "add": {
      const { product, qty = 1, size, color } = action.payload;
      const key = `${product.id}__${size || ""}__${color || ""}`;
      const existing = state.find((i) => i.key === key);
      const img = Array.isArray(product.images) && product.images.length > 0
        ? (typeof product.images[0] === "string" ? product.images[0] : product.images[0].image_url)
        : (product.image || "/images/3be7aa21a985f477_diya1.jpeg");

      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, qty: Math.min(i.qty + qty, 99) } : i
        );
      }
      return [
        ...state,
        {
          key,
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: img,
          size: size || null,
          color: color || null,
          qty: Math.max(1, qty),
        },
      ];
    }
    case "updateQty": {
      const { key, delta } = action.payload;
      return state
        .map((i) => {
          if (i.key === key) {
            const next = i.qty + delta;
            return next > 0 ? { ...i, qty: Math.min(next, 99) } : null;
          }
          return i;
        })
        .filter(Boolean);
    }
    case "remove": {
      return state.filter((i) => i.key !== action.payload.key);
    }
    case "clear": {
      return [];
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, [], readStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items]);

  const addToCart = (product, qty = 1, size = null, color = null) => {
    dispatch({ type: "add", payload: { product, qty, size, color } });
    toast.success(`Added "${product.name}" to cart`);
    setIsOpen(true);
  };

  const updateQty = (key, delta) => {
    dispatch({ type: "updateQty", payload: { key, delta } });
  };

  const removeItem = (key) => {
    dispatch({ type: "remove", payload: { key } });
    toast.info("Item removed from cart");
  };

  const clear = () => {
    dispatch({ type: "clear" });
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQty,
        removeItem,
        clear,
        subtotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
