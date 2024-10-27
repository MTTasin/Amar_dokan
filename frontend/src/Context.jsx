import { useContext, createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
const Context = createContext();

export const StateContext = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cartItemsFromCookie = Cookies.get("cart")
            ? JSON.parse(Cookies.get("cart"))
            : [];
        setCartItems(cartItemsFromCookie);
    }, []);
 
    return (
        <Context.Provider
            value={{
                cartItems,
                setCartItems,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => {
    return useContext(Context);
};
