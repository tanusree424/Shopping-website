import { createContext, useContext, useState } from "react";
import api from "../Api/Api";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
    const userToken = localStorage.getItem("userToken");
    const CartTotal  = async () => {
    try {
        const response = await api.get("/api/cart-count", {
        headers: {
            Authorization: `Bearer ${userToken}`,
        },
        });
        setCartItemsCount(response.data.cart_count);
        console.log(response.data.cart_count)
    } catch (error) {
        console.log(error?.response?.data?.message || error?.message);
    }
    }
    useState(() => {
        if(userToken){
            CartTotal();
        }
    }, [userToken])

  return (
    <CartContext.Provider value={{ cartItemsCount, setCartItemsCount , CartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};