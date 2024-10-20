import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function Card(props) {
  const [cartbutton, setCartbutton] = useState(false);

  function addToCart() {
    if (cartbutton) {
      setCartbutton(false);
      Cookies.remove("id", props.id);

    } else {
      setCartbutton(true);
      Cookies.set("id", [props.id], { expires: 7 });
    }
  }

  useEffect(() => {
    const storeId = Cookies.get("id");
    if (storeId == props.id) {
      setCartbutton(true);
    } else {
      setCartbutton(false);
    }
  }, []);

  

  const tags = props.tags.map((tag) => {
    return (
      <div
        key={tag}
        className="badge badge-outline hover:bg-yellow-300 hover:text-black "
      >
        {tag}
      </div>
    );
  });

  return (
    <div className="card bg-base-900 w-96 shadow-xl hover:scale-105 hover:transition hover:duration-200 hover:ease-in z-0">
      <figure>
        <img src={props.img} alt={props.title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {props.title}
          <div className="badge bg-yellow-300 text-black">
            <span>
              {props.rating > 4 ? <FaStar /> : <FaRegStarHalfStroke />}
            </span>
            {props.rating}
          </div>
        </h2>
        <div className="text-gray-500 card-actions justify-start text-xl">
          ${props.price}
        </div>
        <div className="card-actions justify-end mt-auto">{tags}</div>
        <div className="card-actions justify-center w-full mt-auto">
          <Link
            to={`/product/${props.id}`}
            className="btn btn-primary w-full mt-5"
          >
            View Details
          </Link>

          {cartbutton ? (
            <button className="btn btn-error w-full mt-5" onClick={addToCart}>
              Remove from Cart
            </button>
          ) : (
            <button
              className="btn btn-secondary w-full mt-5"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
