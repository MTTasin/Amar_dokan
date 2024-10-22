import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function CartPage() {
  const [cartCode, setCartCode] = useState(
    Cookies.get("Id")
      ? Array.from(new Set(Cookies.get("Id").split(",")))
      : []
  );
  const [cartItems, setCartItems] = useState([]);

  const fetchData = async () => {
    if (!cartCode.length) return;

    try {
      const responses = await axios.all(
        cartCode.map((id) =>
          axios.get(`http://192.168.0.105:8000/products/${id}/`)
        )
      );
      setCartItems(responses.map((response) => response.data));
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Display error message to the user (optional)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cartitem = cartItems.map((item) => {
    return (
      <div className="justify-between mb-6 rounded-lg  p-6 shadow-md sm:flex sm:justify-start">
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
              <span className="cursor-pointer rounded-l  py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50">
                {" "}
                -{" "}
              </span>
              <input
                className="h-8 w-8 border  text-center text-xs outline-none"
                type="number"
                value="2"
                min="1"
              />
              <span className="cursor-pointer rounded-r  py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50">
                {" "}
                +{" "}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm">$ {item.price}</p>
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
    );
  });

  console.log(cartItems);

  return (
    <>
      <div className="h-screen  pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6  md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">{cartitem}</div>

          <div className="mt-6 h-full rounded-lg border  p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="">Subtotal</p>
              <p className="">$129.99</p>
            </div>
            <div className="flex justify-between">
              <p className="">Shipping</p>
              <p className="">$4.99</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div className="">
                <p className="mb-1 text-lg font-bold">$134.98 USD</p>
                <p className="text-sm">including VAT</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
              Check out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
