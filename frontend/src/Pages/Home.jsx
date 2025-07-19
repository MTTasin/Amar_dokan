import Carou from "../Components/Carousel";
import Card from "../Components/Card";
import useAxios from "../useAxios";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import Categories from "../Components/Categories";
import { Link } from "react-router-dom";
import { FaTruckFast } from "react-icons/fa6";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LuShieldCheck } from "react-icons/lu";

export default function Home() {
  const { response: data, error, loading } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/`);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    if (data) {
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 8));
    }
  }, [data]);

  const CardData = randomProducts && randomProducts.map((product) => {
    return (
      <Card
        key={product.id}
        id={product.id}
        title={product.title}
        img={product.thumbnail}
        price={product.price}
        tags={product.tags}
        rating={product.rating}
        sku={product.sku}
      />
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gray-50 bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <div className="container mx-auto px-4 py-8">
          

          <Carou />

          <Categories />

          <section className="py-12">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {CardData}
            </div>
            <div className="text-center mt-12">
              <Link to="/AllProducts">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105">
                  View All Products
                </button>
              </Link>
            </div>
          </section>

          <section className="py-12 bg-white rounded-lg shadow-md mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
              <div className="flex flex-col items-center text-center p-6">
                <FaTruckFast className="text-blue-600 text-5xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Get your orders delivered quickly and efficiently.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <TfiHeadphoneAlt className="text-blue-600 text-5xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Customer Service</h3>
                <p className="text-gray-600">Our friendly support team is always here to help you.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <LuShieldCheck className="text-blue-600 text-5xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Money Back Guarantee</h3>
                <p className="text-gray-600">Shop with confidence, knowing your purchase is protected.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
