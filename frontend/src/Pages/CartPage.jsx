import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function CartPage() {
  const [cartCode, setCartCode] = useState(
    Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : []
  );
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    if (!cartCode.length) return;
    const cartID = cartCode.map(item => item.id);
    
    try {
      const responses = await axios.all(
        cartID.map((id) =>
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}/`)
        )
      );
      const limitedCartItems = responses.map((response) => ({
        id: response.data.id,
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        price: response.data.price,
        stock: response.data.stock,
        quantity: cartCode.find((item) => item.id === response.data.id).quantity
      }));
      setCartItems(limitedCartItems);
      
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const increaseQuantity = (id) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } : item
      )
    );
  };
  
  const decreaseQuantity = (id) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
      )
    );
  };

  const totalPriceCalc = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += parseFloat(item.price * item.quantity);
    });
    setTotalPrice(total);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const newCartItems = cartItems.filter((item) => item.id !== id);
      setCartItems(newCartItems);
      const newCartCode = cartCode.filter((item) => item.id !== id);
      setCartCode(newCartCode);
      Cookies.set("cart", JSON.stringify(newCartCode), { expires: 7 });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    totalPriceCalc();
  }, [cartItems]);

  const cartitem = cartItems.map((item) => {
    return (
      <div key={item.id} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${item.thumbnail}`}
          alt={item.title}
          className="w-24 h-24 object-cover rounded-md mr-4"
        />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
          <p className="text-gray-600 text-sm">Price: ${item.price}</p>
          <div className="flex items-center mt-2">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 transition duration-300"
            >
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              readOnly
              className="w-12 text-center border-t border-b border-gray-300 py-1 text-gray-800"
            />
            <button
              onClick={() => increaseQuantity(item.id)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 transition duration-300"
            >
              +
            </button>
            <p className="ml-auto text-lg font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <button
          onClick={() => handleDelete(item.id)}
          className="ml-4 text-red-500 hover:text-red-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600 text-lg py-10">
          Your cart is empty. <Link to="/AllProducts" className="text-blue-600 hover:underline">Start shopping now!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartitem}
          </div>

          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Shipping</span>
              <span>$4.99</span>
            </div>
            <hr className="border-gray-300 mb-4" />
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>${(totalPrice + 4.99).toFixed(2)}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
