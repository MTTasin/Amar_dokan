import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";

export default function Carousel_edit() {
  const [carousel, setCarousel] = useState([]);
  const params = useParams();
  function fetchData() {
    fetch("http://127.0.0.1:8000/carousels/")
      .then((response) => response.json())
      .then((data) => setCarousel(data));
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  
  function handleClick(id) {
    fetch(`http://127.0.0.1:8000/carousels/${id}/`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => fetchData());
  }
    

  const data = carousel.map((carousel) => {
    return (
      <div key={carousel.id} className="grid grid-cols-4 bg-base-300 m-4 text-center rounded-md">
        <div><img src={carousel.image} alt="" className="rounded-lg" /></div>
        <div className="my-auto">{carousel.name}</div>
        <div>{carousel.link}</div>
        <div className="flex self-center"><button className="btn btn-error mx-auto" onClick={handleClick.bind(null, carousel.id)}>Delete</button></div>
      </div>
    );
  });

  return <div>{data}</div>;
}
