import { useContext, createContext, useState, useEffect } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
 
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
