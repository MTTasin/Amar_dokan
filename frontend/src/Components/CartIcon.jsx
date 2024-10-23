import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useStateContext } from "../Context";
import Cookies from "js-cookie";

export default function Cart() {
    const location = useLocation();
    const pathname = location.pathname;
    const [cartCode, setCartCode] = useState(Cookies.get("Id") ? Array.from(new Set(Cookies.get("Id").split(","))) : []);

    const { cartItems, setCartItems } = useStateContext();

    useEffect(() => {
      setCartCode(Cookies.get("Id") ? Array.from(new Set(Cookies.get("Id").split(","))) : []);
    }, [cartItems]);

  return (
    <div className={cartCode.length > 0 ? "" : "hidden"}>
      <Link to="/cart">
      <div className={`z-50 fixed top-20 right-5 bg-secondary text-white w-10 h-10 rounded-full flex justify-center items-center cursor-pointer ${pathname === "/cart" ? "hidden" : "" }`}>
        <div className="indicator">
          <FaShoppingCart className="text-xl" />
          <span className="badge badge-xs badge-primary indicator-item text-white p-2">{cartCode.length}</span>
        </div>
      </div>
    </Link>
    </div>
  );
}
