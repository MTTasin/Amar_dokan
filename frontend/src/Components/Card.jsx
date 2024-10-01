import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { useState } from "react";

export default function Card(props) {
    const [cartbutton, setCartbutton] = useState(0)

    

    const tags = props.tags.map((tag) => {
        return (
            <div className="badge badge-outline hover:bg-yellow-300 hover:text-black ">{tag}</div>
        )
    })

  return (
    <div className="card bg-base-900 w-96 shadow-xl hover:scale-105 hover:transition hover:duration-200 hover:ease-in">
      <figure>
        <img
          src={props.img}
          alt={props.title}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {props.title}
          <div className="badge bg-yellow-300 text-black"><span>{props.rating > 4 ? <FaStar /> : <FaRegStarHalfStroke />}</span>{props.rating}</div>
        </h2>
        <div className="text-gray-500 card-actions justify-start text-xl">${props.price}</div>
        <div className="card-actions justify-end">
            {tags}
        </div>
        <div className="card-actions justify-center">
            <button className="btn btn-primary w-full mt-5">View Details</button>


            {cartbutton === 0 ? (<button className="btn btn-secondary w-full mt-3" onClick={() => setCartbutton(cartbutton + 1)}>Add to cart</button>)
            : (
<div className="flex justify-evenly w-full">
                <span><button className="btn btn-secondary w-full rounded-full mt-3" onClick={() => setCartbutton(cartbutton - 1)}>-</button></span>
                <span><p className="text-3xl mt-3">{cartbutton}</p></span>
                <span><button className="btn btn-primary w-full rounded-full mt-3" onClick={() => setCartbutton(cartbutton + 1)}>+</button></span>
            </div>
            ) }




            
            
        </div>
      </div>
    </div>
  );
}
