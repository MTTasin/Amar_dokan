import Carou from "../Components/Carousel";
import Card from "../Components/Card";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import Categories from "../Components/Categories";
import { Link } from "react-router-dom";



export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  


  const fetchData = () => {
    setLoading(true);
    
    axios
      .get(`http://192.168.0.105:8000/products/`)
      .then((res) => {
        const randomProducts = res.data.sort(() => Math.random() - 0.5).slice(0, 8);
        setData(randomProducts);
        setLoading(false);
        
      })
      .catch((err) => {
        console.log(err);
        
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const CardData = data.map((product) => {
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
        <div className={loading ? "opacity-10 z-0" : ""} >
          <div><h1 className="text-3xl font-bold text-red-500 text-center">This project is still under development</h1></div>
          <div><h1 className="text-3xl font-bold text-green-500 text-center">Last Updated 8th September 2024</h1></div>
    
          <div>
          <Carou />
          </div>
          <div>
            <Categories />
          </div>
          <div className="flex flex-wrap justify-center gap-4 p-4 ">
            {CardData}
          </div>
          <div className="flex justify-center m-5">
            <Link to="/AllProducts"><button className="btn bg-pink-500 rounded-none text-xl text-center text-white mt-10">View all products</button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
