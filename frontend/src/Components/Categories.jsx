import { useId } from "react";
import "./Categories.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import { Button } from "@mantine/core";

export default function Categories() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);

  const randomId = useId();

  useEffect(() => {
    axios
      .get("https://amardokanbackend.tasinblog.com/products/")
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
        <Link key={randomId} to={`/products/${category}`}>
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

  const scrollLeft = () => {
    const element = document.getElementById("categories");
    const scrollDistance = 200; // Adjust as needed
    const duration = 500; // Adjust as needed

    const startTime = new Date().getTime();
    const initialScrollPosition = element.scrollLeft;

    const animate = () => {
      const elapsedTime = new Date().getTime() - startTime;
      const progress = elapsedTime / duration;
      const scrollPosition = initialScrollPosition + scrollDistance * progress;

      element.scrollLeft = scrollPosition;

      if (elapsedTime < duration) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };
  const scrollRight = () => {
    const element = document.getElementById("categories");
    const scrollDistance = 200; // Adjust as needed
    const duration = 500; // Adjust as needed

    const startTime = new Date().getTime();
    const initialScrollPosition = element.scrollLeft;

    const animate = () => {
      const elapsedTime = new Date().getTime() - startTime;
      const progress = elapsedTime / duration;
      const scrollPosition = initialScrollPosition - scrollDistance * progress;

      element.scrollLeft = scrollPosition;

      if (elapsedTime < duration) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <>
      <div className="relative">
        <h2 className="text-3xl font-bold p-4 border-l-[20px] rounded-xl border-pink-500 my-10">
          Categories
        </h2>
        <div className="absolute top-5 right-5 hidden md:block">
          <Button onClick={scrollRight} className="hover:text-pink-600">
            <FaRegArrowAltCircleLeft className="text-3xl" />
          </Button>
          <Button onClick={scrollLeft} className="hover:text-pink-600">
            <FaRegArrowAltCircleRight className="text-3xl" />
          </Button>
        </div>

        <div
          id="categories"
          className="list flex no-wrap justify-evenly uppercase overflow-x-auto gap-2"
        >
          {categoryCard}
        </div>
      </div>
    </>
  );
}
