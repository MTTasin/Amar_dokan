import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "../Components/Card";
import Categories from "../Components/Categories";
import Loader from "../Components/Loader/Loader";



export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);

  

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`https://amardokanbackend.tasinblog.com/products/?page=${currentPage}`, {
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
      .get(`https://amardokanbackend.tasinblog.com/products/`, {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setTotalProducts(res.data.length);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  

  function totLimit() {
    if ((currentPage+1) * 10 <= totalProducts) {
      setReachedEnd(false);
    } else if (currentPage === 0) {
      setReachedEnd(false);
    } else {
      setReachedEnd(true);
    }
  }


  useEffect(() => {
    fetchProducts();
    fetchTotalProducts();
    totLimit();
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
        sku={product.sku}
      />
    );
  });



  const increasepage = () => {
    setCurrentPage(currentPage + 1);
    scrollTo(0, 0);
    
  };
  const decreasepage = () => {
    setCurrentPage(currentPage - 1);
    scrollTo(0, 0);
  };



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


          <div className="flex justify-center">
            {currentPage > 0 ? (
              <div className="btn btn-secondary w-[150px] m-5" onClick={decreasepage}>Previous</div>
            ): (
              <div className="btn btn-secondary w-[150px] m-5" disabled>Previous</div>
            )}
            {reachedEnd ? (
              <div className="btn btn-secondary w-[150px] m-5" disabled>Next</div>
            ): (
              <div className="btn btn-secondary w-[150px] m-5" onClick={increasepage}>Next</div>
            )}
          </div>
   
        

        </div>
      </div>
    </>
  );
}
