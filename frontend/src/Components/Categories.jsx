import "./Categories.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Categories() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.0.105:8000/products/")
      .then((res) => {
        const uniqueClasses = new Set(res.data.map((item) => item.category));
        const classesArray = Array.from(uniqueClasses);
        setCategories(classesArray);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const categoryCard = categories.map((category) => {
    return (
      <>
        <Link to={`/products/${category}`}>
          <div className="card bg-white hover:bg-slate-300 w-32 h-48 shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src={`/${category}.svg`}
                alt={category}
                className="w-10 h-10"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-sm uppercase text-black">
                {category}
              </h2>
            </div>
          </div>
        </Link>
      </>
    );
  });

  return (
    <>
      <div className="list flex no-wrap justify-evenly uppercase overflow-x-auto gap-2">
        {categoryCard}
      </div>
    </>
  );
}
