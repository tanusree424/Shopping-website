import { createContext, useContext, useState, useEffect } from "react";
import api from "../Api/Api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const userToken = localStorage.getItem("userToken");

  // ✅ Fetch cart count
  const CartTotal = async () => {
    try {
      const response = await api.get("/api/cart-count", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCartItemsCount(response.data.cart_count);
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  // ✅ Correct Hook
  useEffect(() => {
    if (userToken) {
      CartTotal();
    } else {
      setCartItemsCount(0);
    }
  }, [userToken]);

  return (
    <CartContext.Provider
      value={{ cartItemsCount, setCartItemsCount, CartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};