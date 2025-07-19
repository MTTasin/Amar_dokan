import useAxios from "../useAxios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Categories from "../Components/Categories";
import Loader from "../Components/Loader/Loader";



export default function AllProducts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);

  const { response: products, error, loading } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/?page=${currentPage}`);
  const { response: totalProducts } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/`);

  function totLimit() {
    if ((currentPage+1) * 10 <= totalProducts.length) {
      setReachedEnd(false);
    } else if (currentPage === 0) {
      setReachedEnd(false);
    } else {
      setReachedEnd(true);
    }
  }


  useEffect(() => {
    if (totalProducts) {
      totLimit();
    }
  }, [totalProducts, currentPage]);



  const CardData = products && Array.isArray(products) ? products.map((product) => {
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
  }) : null;



  const increasepage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
    
  };
  const decreasepage = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gray-50 bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">All Products</h2>
          {error && <div className="text-center text-red-500 mb-4">Error: {error.message}</div>}
          {!products || products.length === 0 && !loading && !error ? (
            <div className="text-center text-gray-600 text-lg">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {CardData}
            </div>
          )}

          <div className="flex justify-center items-center mt-12 space-x-4">
            <button
              onClick={decreasepage}
              disabled={currentPage === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-lg font-semibold text-gray-700">Page {currentPage + 1}</span>
            <button
              onClick={increasepage}
              disabled={reachedEnd}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
