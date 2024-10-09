import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Categories from "../Components/Categories";
import Loader from "../Components/Loader/Loader";
import Pagination from "../Components/pagination";


export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://192.168.0.105:8000/products/?page=${currentPage}`, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchTotalProducts = () => {
    axios
      .get(`http://192.168.0.105:8000/products/`, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setTotalProducts(res.data.count);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchTotalProducts();
  }, [currentPage]);




  const CardData = products.map((product) => {
    return (
      <Card
        key={product.id}
        id={product.id}
        title={product.title}
        img={product.thumbnail}
        price={product.price}
        tags={product.tags}
        rating={product.rating}
      />
    );
  });




  return (
    <>
      <div className="relative">
        {loading && (
          <div className="flex justify-center items-center h-[80vh] w-[100vw] z-10 absolute">
            <Loader />
          </div>
        )}
        <div className={loading ? "opacity-10 z-0" : ""}>
            <div><Categories /></div>
          <div className="flex flex-wrap justify-center gap-4 p-4 ">
            {CardData}
          </div>


          
   
        

        </div>
      </div>
    </>
  );
}
