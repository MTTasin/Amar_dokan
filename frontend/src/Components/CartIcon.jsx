import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Cart() {
    const location = useLocation();
    const pathname = location.pathname;
  return (
    <Link to="/cart">
      <div className={`z-50 fixed top-20 right-5 bg-secondary text-white w-10 h-10 rounded-full flex justify-center items-center cursor-pointer ${pathname === "/cart" ? "hidden" : "" }`}>
        <div className="indicator">
          <FaShoppingCart className="text-xl" />
          <span className="badge badge-xs badge-primary indicator-item text-white p-2"></span>
        </div>
      </div>
    </Link>
  );
}
