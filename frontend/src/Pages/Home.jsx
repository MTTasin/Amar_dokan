import Carou from "../Components/Carousel";
import Card from "../Components/Card";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";
import Categories from "../Components/Categories";
import { Link } from "react-router-dom";
import { FaTruckFast } from "react-icons/fa6";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { LuShieldCheck } from "react-icons/lu";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    axios
      .get(`https://amardokanbackend.tasinblog.com/products/`)
      .then((res) => {
        const randomProducts = res.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);
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
        sku={product.sku}
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
          <div>
            <h1 className="text-3xl font-bold text-red-500 text-center">
              This project is still under development and will be completed very soon.
            </h1>
          </div>

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
            <Link to="/AllProducts">
              <button className="btn bg-pink-500 rounded-none text-xl text-center text-white mt-10">
                View all products
              </button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div className="card">
            <figure>
              <FaTruckFast size={50} className="rounded-full border p-3" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Fast delivery</h2>
              <p>Fast delivery within 24 hours</p>
            </div>
          </div>
          <div className="card">
            <figure>
              <TfiHeadphoneAlt
                size={50}
                className="rounded-full border p-3"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">24/7 customer service</h2>
              <p>Friendly 24/7 customer support.</p>
            </div>
          </div>
          <div className="card">
            <figure>
              <LuShieldCheck size={50} className="rounded-full border p-3" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Money back guarantee</h2>
              <p>30 days money back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
