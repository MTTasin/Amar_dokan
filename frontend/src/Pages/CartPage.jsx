import { useState, useEffect } from "react";
import axios from "axios";


export default function CartPage() {

    const [count, setCount] = useState(1);

    const [data, setData] = useState([
      {
          title: "",
          thumbnail: "",
          price: "",
          sku: ""
      }
    ]);

    const fetchData = () => {
      axios
        .get(`http://192.168.0.105:8000/products/?sku=XNIH1MTA`)
        .then((res) => {
          setData(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        })
    };

    useEffect(() => {
      fetchData();
    }, []);



    const increase = () => {
      setCount(count + 1);
    };
  
    const decrease = () => {
      if (count > 1) {
        setCount(count - 1);
      }
    };



  return (
    <div className="mb-20">
      <div className="h-screen pt-20">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto w-full justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            <div className="justify-between mb-6 rounded-lg  p-6 bg-base-300 shadow-md sm:flex sm:justify-start">
              <img
                src={data.thumbnail}
                alt="product-image"
                className="w-full h-32 rounded-lg sm:w-40"
              />
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-bold">{data.title}</h2>
                  <p className="mt-1 text-s ">{data.price}</p>
                </div>
                <div className="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                  <div className="flex items-center border-gray-100">
                    <span onClick={decrease} className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50">
                      {" "}
                      -{" "}
                    </span>
                    <input
                      className="h-8 w-8 border-gray-100 text-center text-s outline-none"
                      type="number"
                      value={count}
                      min="1"
                      disabled
                    />
                    <span onClick={increase} className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50">
                      {" "}
                      +{" "}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg">Total: ${count * data.price}</p>
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

          {/* <div className="mt-6 h-full rounded-lg border  p-6 shadow-md md:mt-0 md:w-1/3">
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
                <p className="text-sm ">including VAT</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
              Check out
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
