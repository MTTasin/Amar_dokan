import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";

export default function Card(props) {

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
      </div>
    </div>
  );
}
