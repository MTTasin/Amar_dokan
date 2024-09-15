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

    fetchData();
  }

  function handleDelete(id) {
    handleClick(id);
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
      .then(() => fetchData());
  }

  function addclick() {
    if (caroudata.name === "" || caroudata.image === "") {
      setAlert(true);
    }
     else {
      setAlert(false);
      fetchData();
      document.getElementById("my_modal_2").close();
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
        <div>{carousel.link}</div>
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
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          Add Carousels
        </button>
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
        <form action="" onSubmit={handlesubmit}>
        <input  type="text" placeholder="Image Link" name="image"  className="input input-bordered w-full max-w-xs text-white" onChange={(e) => setCaroudata({ ...caroudata, image: e.target.value })} />
        <input  type="text" placeholder="Name" name="name" className="input input-bordered w-full max-w-xs text-white" onChange={(e) => setCaroudata({ ...caroudata, name: e.target.value })} />
        <input type="text" placeholder="Link" name="link" className="input input-bordered w-full max-w-xs text-white" onChange={(e) => setCaroudata({ ...caroudata, link: e.target.value })} />
        {alert && <p className="text-red-500">Please fill all the fields</p>}
        <button type="submit" className="btn btn-primary w-full max-w-xs mt-4" onClick={addclick}>Add</button>
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
