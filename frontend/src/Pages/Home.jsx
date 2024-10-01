import Carou from "../Components/Carousel";
import Card from "../Components/Card";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader/Loader";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(9);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`http://192.168.0.105:8000/products/?limit=${limit}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, [limit]);

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
        <div className={loading ? "opacity-10 z-0" : ""}>
          <Carou />

          <div className="flex flex-wrap justify-center gap-4 p-4 ">
            {CardData}
          </div>
          <div className="flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => setLimit(limit + 10)}
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
