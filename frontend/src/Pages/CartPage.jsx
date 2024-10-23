import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function CartPage() {
  const [cartCode, setCartCode] = useState(
    Cookies.get("Id") ? Array.from(new Set(Cookies.get("Id").split(","))) : []
  );
  const [cartItems, setCartItems] = useState([
    {
      id: "",
      title: "",
      thumbnail: "",
      price: "",
      stock: "",
      quantity: 1,
    }
  ]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    if (!cartCode.length) return;

    try {
      const responses = await axios.all(
        cartCode.map((id) =>
          axios.get(`http://192.168.0.105:8000/products/${id}/`)
        )
      );
      const limitedCartItems = responses.map((response) => ({
        id: response.data.id,
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        price: response.data.price,
        stock: response.data.stock,
        quantity: 1, // Assuming a default quantity of 1
      }));
      setCartItems(limitedCartItems);
      
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Display error message to the user (optional)
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== id)
      );
      const updatedCartCode = cartCode.filter((code) => code !== id);
      setCartCode(updatedCartCode); // Update the cartCode state
      Cookies.set("Id", updatedCartCode.join(","), { expires: 7 });
    }
  };


  const totalPriceCalc = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += parseFloat(item.price * item.quantity);
    });
    setTotalPrice(total.toFixed(2));
  };



  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    totalPriceCalc();
  }, [cartItems]);

  console.log(cartItems);

  const cartitem = cartItems.map((item) => {
    return (
      <div className="justify-between mb-6 rounded-lg  p-6 shadow-md sm:flex sm:justify-start0">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full rounded-lg sm:w-40"
        />
        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
          <div className="mt-5 sm:mt-0">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="mt-1 text-xs">$ {item.price}</p>
          </div>
          <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
            <div className="flex items-center border-gray-100">
              <span onClick={() => decreaseQuantity(item.id)} className="cursor-pointer rounded-l  py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50">
                {" "}
                -{" "}
              </span>
              <input
                className="h-8 w-8 border  text-center text-xs outline-none"
                type="number"
                value={item.quantity}
                min="1"
                max={item.stock}
              />
              <span onClick={() => increaseQuantity(item.id)} className="cursor-pointer rounded-r  py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50">
                {" "}
                +{" "}
              </span>
            </div>
            <div className="flex items-center space-x-4">
            <p className="text-sm">$ {(item.price * item.quantity).toFixed(2)}</p>
              <div onClick={() => handleDelete(item.id)} >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {cartItems.Id === undefined ? (
        <div className="pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6  md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">{cartitem}</div>

          <div className="mt-6 h-full rounded-lg border  p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="">Subtotal</p>
              <p className="">{totalPrice}</p>
            </div>
            <div className="flex justify-between">
              <p className="">Shipping</p>
              <p className="">$4.99</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div className="">
              <p className="mb-1 text-lg font-bold">${(parseFloat(totalPrice) + 4.99).toFixed(2)}</p>
                <p className="text-sm">including VAT</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
              Check out
            </button>
          </div>
        </div>
      </div>
      ):(
        <div>
          <h1 className="pt-20 text-center text-2xl font-bold">Your cart is empty</h1>
        </div>
      )}
    </>
  );
}
