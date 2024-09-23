import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import { useParams } from "react-router-dom";

export default function Carousel_edit() {
  const [carousel, setCarousel] = useState([]);
  const params = useParams();
  const [alert , setAlert] = useState(false);
  const [caroudata, setCaroudata] = useState(
    {
      name: "",
      image: "",
      link: "",
    }
  );

  const { response, error, loading } = useFetch(
    `http://127.0.0.1:8000/carousels/`
  );


  function fetchData() {
    fetch(`http://127.0.0.1:8000/carousels/`)
      .then((response) => response.json())
      .then((data) => setCarousel(data));
  }

  useEffect(() => {
    if (response) {
      setCarousel(response);
    }

  }, [response]);

  function handleClick(id) {
    fetch(`http://127.0.0.1:8000/carousels/${id}/`, {
      method: "DELETE",
    })
      .then((response) => response.json());
      
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?"))
      handleClick(id);

    fetchData();
  }

  function handlesubmit(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/carousels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(caroudata),
    })
      .then((response) => response.json())
      .then(() => fetchData())
      .then(setCaroudata({ name: "", image: "", link: "" }));
  }

  function addclick() {
    if (caroudata.name === "" || caroudata.image === "") {
      setAlert(true);
    }
     else {
      setAlert(false);
      fetchData();
      document.getElementById("carousel").close();
    }
  }

  const data = carousel.map((carousel) => {
    return (
      <div
        key={carousel.id}
        className="grid grid-cols-4 bg-base-300 m-4 text-center rounded-md"
      >
        <div>
          <img src={carousel.image} alt="" className="rounded-lg" />
        </div>
        <div className="my-auto">{carousel.name}</div>
        <div className="my-auto">{carousel.link}</div>
        <div className="flex self-center">
          <button
            className="btn btn-error mx-auto"
            onClick={handleDelete.bind(null, carousel.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      <h1 className="text-3xl text-center font-bold">Manage the Carousels</h1>
      <div className="divider"></div>






      <div className="flex justify-center">
        <button
          className="btn btn-primary my-4 w-[75vw]"
          onClick={() => document.getElementById("carousel").showModal()}
        >
          Add Carousels
        </button>
      </div>
      <dialog id="carousel" className="modal">
        <div className="modal-box">
        <form action="" onSubmit={handlesubmit} className="flex flex-col gap-4">
        <input  type="text" placeholder="Image Link" name="image" value={caroudata.image} className="input input-bordered w-full max-w-xs mx-auto text-white" onChange={(e) => setCaroudata({ ...caroudata, image: e.target.value })} />
        <input  type="text" placeholder="Name" name="name" value={caroudata.name} className="input input-bordered w-full max-w-xs mx-auto text-white" onChange={(e) => setCaroudata({ ...caroudata, name: e.target.value })} />
        <input type="text" placeholder="Link" name="link" value={caroudata.link} className="input input-bordered w-full max-w-xs mx-auto text-white" onChange={(e) => setCaroudata({ ...caroudata, link: e.target.value })} />
        {alert && <p className="text-red-500">Please fill all the fields</p>}
        <button type="submit" className="btn btn-primary w-full mx-auto max-w-xs mt-4" onClick={addclick}>Add</button>
        </form>

        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>





      <div>{data}</div>
    </>
  );
}
