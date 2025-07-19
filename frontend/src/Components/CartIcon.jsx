import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStateContext } from "../Context";
import Cookies from "js-cookie";

export default function Cart() {
    const location = useLocation();
    const pathname = location.pathname;
    const { cartItems } = useStateContext();
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
      setTotalQuantity(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    }, [cartItems]);

  return (
    <div className={totalQuantity === 0 ? "hidden" : ""}>
      <Link to="/cart">
        <div className={`fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-300 z-50 ${pathname === "/cart" ? "hidden" : ""}`}>
          <div className="relative">
            <FaShoppingCart className="text-2xl" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
