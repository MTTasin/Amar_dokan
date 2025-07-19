import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { useState, useEffect, useContext } from "react";
import { useStateContext } from "../Context";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function Card(props) {
  const [cartbutton, setCartbutton] = useState(false);
  const { cartItems, setCartItems } = useStateContext();
  
  useEffect(() => {
    const cartItemsFromCookie = Cookies.get("cart");
    if (cartItemsFromCookie) {
      setCartItems(JSON.parse(cartItemsFromCookie));
    }
  }, []);

  const addToCart = () => {
    setCartbutton(true);
    const cartItem = { id: props.id, quantity: 1 };
    const updatedCartItems = [...cartItems, cartItem];
    setCartItems(updatedCartItems);
    Cookies.set("cart", JSON.stringify(updatedCartItems), { expires: 7 });
  }
  
  const removeFromCart = () => {
    setCartbutton(false);
    const updatedCartItems = cartItems.filter(item => item.id.toString() !== props.id.toString());
    setCartItems(updatedCartItems);
    Cookies.set("cart", JSON.stringify(updatedCartItems), { expires: 7 });
  }


  

  useEffect(() => {
    const cartItems = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    const itemInCart = cartItems.find(item => item.id.toString() === props.id.toString());
    if (itemInCart) {
      setCartbutton(true);
    } else {
      setCartbutton(false);
    }
  }, []);

  

  const tags = props.tags && props.tags.map((tag) => {
    return (
      <span
        key={tag}
        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >
        #{tag}
      </span>
    );
  });

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white transform hover:-translate-y-1 hover:scale-105 transition duration-300 ease-in-out">
      <img className="w-full h-48 object-cover" src={`${import.meta.env.VITE_API_BASE_URL}${props.img}`} alt={props.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-800">{props.title}</div>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 flex items-center">
            {props.rating > 4 ? <FaStar /> : <FaRegStarHalfStroke />}
            <span className="ml-1 text-gray-600 text-sm">{props.rating}</span>
          </span>
          <span className="ml-auto text-2xl font-bold text-gray-900">${props.price}</span>
        </div>
        <p className="text-gray-700 text-base mb-4">
          {props.description ? props.description.substring(0, 100) + '...' : 'No description available.'}
        </p>
        <div className="px-6 pt-4 pb-2">
          {tags}
        </div>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <Link
          to={`/product/${props.id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
        >
          View Details
        </Link>
        {cartbutton ? (
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm" onClick={removeFromCart}>
            Remove from Cart
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 text-sm"
            onClick={addToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
