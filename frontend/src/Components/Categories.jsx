import { useId } from "react";
import "./Categories.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const randomId = useId();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/products/`)
      .then((res) => {
        const uniqueClasses = new Set(res.data.map((item) => item.category));
        const classesArray = Array.from(uniqueClasses);
        setCategories(classesArray);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const categoryCard = categories.map((category) => {
    return (
      <Link key={randomId} to={`/products/${category}`}>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <img
            src={`/${category}.svg`}
            alt={category}
            className="w-16 h-16 mb-2 object-contain"
          />
          <h2 className="text-sm font-semibold uppercase text-gray-800 text-center">
            {category}
          </h2>
        </div>
      </Link>
    );
  });

  const scrollLeft = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    const element = document.getElementById("categories");
    if (element) {
      element.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
        <div className="hidden md:flex space-x-2">
          <button onClick={scrollLeft} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 focus:outline-none">
            <FaRegArrowAltCircleLeft className="text-2xl text-gray-700" />
          </button>
          <button onClick={scrollRight} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 focus:outline-none">
            <FaRegArrowAltCircleRight className="text-2xl text-gray-700" />
          </button>
        </div>
      </div>

      <div
        id="categories"
        className="flex overflow-x-scroll pb-4 space-x-4 scrollbar-hide"
      >
        {categoryCard}
      </div>
    </div>
  );
}
