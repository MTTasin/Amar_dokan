import { Link, useParams } from "react-router-dom";
import DetailsSwiper from "../Components/DetailsSwiper";
import StarReview from "../Components/StarReview";
import useAxios from "../useAxios";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import { useStateContext } from "../Context";
import Cookies from "js-cookie";

export default function ProductDetails() {
  const params = useParams();
  const { response: data, error, loading } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/${params.id}/`);
  const { cartItems, setCartItems } = useStateContext();
  const [cartbutton, setCartbutton] = useState(false);

  useEffect(() => {
    if (data) {
      const itemInCart = cartItems.find(item => item.id.toString() === data.id.toString());
      if (itemInCart) {
        setCartbutton(true);
      } else {
        setCartbutton(false);
      }
    }
  }, [cartItems, data]);

  const addToCart = () => {
    if (data) {
      setCartbutton(true);
      const cartItem = { id: data.id, quantity: 1 };
      const updatedCartItems = [...cartItems, cartItem];
      setCartItems(updatedCartItems);
      Cookies.set("cart", JSON.stringify(updatedCartItems), { expires: 7 });
    }
  };

  const removeFromCart = () => {
    if (data) {
      setCartbutton(false);
      const updatedCartItems = cartItems.filter(item => item.id.toString() !== data.id.toString());
      setCartItems(updatedCartItems);
      Cookies.set("cart", JSON.stringify(updatedCartItems), { expires: 7 });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        Error loading product details: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-600 text-xl mt-10">
        Product not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="text-sm breadcrumbs mb-6 text-gray-600">
        <ul>
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to={`/products/${data.category}`} className="capitalize hover:text-blue-600">{data.category}</Link></li>
          <li><span className="text-gray-800 font-semibold">{data.title}</span></li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <DetailsSwiper />
        </div>

        <div className="md:col-span-1 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{data.title}</h1>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{data.description}</p>

            <div className="flex items-center mb-6">
              <StarReview rating={data.rating} />
              <span className="text-yellow-600 text-xl ml-2 font-semibold">{data.rating}</span>
              <span className="text-gray-500 text-sm ml-4">({data.reviews ? data.reviews.length : 0} reviews)</span>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-6">${data.price}</div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2"><span className="font-semibold">Brand:</span> {data.brand || 'N/A'}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">SKU:</span> {data.sku}</p>
              <p className="text-gray-700 mb-2"><span className="font-semibold">Stock:</span> {data.stock > 0 ? <span className="text-green-600">In Stock ({data.stock})</span> : <span className="text-red-600">Out of Stock</span>}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Details:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><span className="font-semibold">Weight:</span> {data.weight} kg</li>
                <li><span className="font-semibold">Dimensions:</span> {data.dimensions ? `${data.dimensions.width}x${data.dimensions.height}x${data.dimensions.depth} cm` : 'N/A'}</li>
                <li><span className="font-semibold">Warranty:</span> {data.warrantyInformation}</li>
                <li><span className="font-semibold">Shipping:</span> {data.shippingInformation}</li>
                <li><span className="font-semibold">Return Policy:</span> {data.returnPolicy}</li>
                <li><span className="font-semibold">Min Order Quantity:</span> {data.minimumOrderQuantity}</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            {cartbutton ? (
              <button
                onClick={removeFromCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Remove from Cart
              </button>
            ) : (
              <button
                onClick={addToCart}
                disabled={data.stock === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {data.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}