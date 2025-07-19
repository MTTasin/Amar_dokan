import { useState, useEffect } from "react";
import useAxios from "../useAxios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../features/auth/authSlice";
import axios from "axios";
import Loader from "../Components/Loader/Loader";
import { toast } from "react-toastify";

export default function CarouselManagement() {
  const [carousel, setCarousel] = useState([]);
  const params = useParams();
  const [alert , setAlert] = useState(false);
  const [caroudata, setCaroudata] = useState(
    {
      name: "",
      image: null,
      link: "",
    }
  );

  const { response: fetchedCarousels, error: fetchError, loading: fetchLoading } = useAxios(
        `${import.meta.env.VITE_API_BASE_URL}/carousels/`
  );

  useEffect(() => {
    if (Array.isArray(fetchedCarousels)) {
      setCarousel(fetchedCarousels);
    } else if (fetchedCarousels && Array.isArray(fetchedCarousels.data)) {
      setCarousel(fetchedCarousels.data);
    } else if (fetchedCarousels && Array.isArray(fetchedCarousels.results)) {
      setCarousel(fetchedCarousels.results);
    } else {
      setCarousel([]);
    }
  }, [fetchedCarousels]);

  function fetchData() {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/carousels/`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCarousel(res.data);
        } else {
          console.error("API response for carousels is not an array:", res.data);
          setCarousel([]); // Ensure it's always an array on unexpected response
        }
      })
      .catch((err) => {
        console.error("Error fetching carousels:", err);
        setCarousel([]); // Ensure it's always an array on error
      });
  }


  const dispatch = useDispatch();
  const { user, userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

  function handleClick(id) {
    axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/carousels/${id}/`, {
        headers: {
          "Authorization": `JWT ${user.access}`,
        },
      })
      .then(() => {
        fetchData();
        toast.success("Carousel deleted successfully!");
      })
      .catch((err) => {
        toast.error("Failed to delete carousel.");
        console.error("Delete carousel error:", err);
      });
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this item?"))
      handleClick(id);
  }

  function handlesubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', caroudata.name);
    formData.append('image', caroudata.image);
    formData.append('link', caroudata.link);

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/carousels/`, formData, {
      headers: {
        "Authorization": `JWT ${user.access}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        fetchData();
        setCaroudata({
          name: "",
          image: null,
          link: "",
        });
        document.getElementById("carousel_modal").close();
        toast.success("Carousel added successfully!");
      })
      .catch((err) => {
        toast.error("Failed to add carousel.");
        console.error("Add carousel error:", err);
      });
  }

  if (!userInfo.is_staff && !userInfo.is_superuser) {
    return <div className="text-red-500">Access Denied: Staff or Superuser privilege required.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {fetchLoading && (
        <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gray-50 bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      <div className={fetchLoading ? "opacity-50 pointer-events-none" : "container mx-auto px-4"}>
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Carousels</h1>

        {fetchError && <div className="text-center text-red-500 mb-4">Error: {fetchError.message}</div>}

        <div className="flex justify-center mb-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => document.getElementById("carousel_modal").showModal()}
          >
            Add New Carousel
          </button>
        </div>

        <dialog id="carousel_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box p-6 bg-white rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl text-gray-800 mb-6">Add New Carousel Item</h3>
            <form onSubmit={handlesubmit} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="carousel_name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="carousel_name"
                  type="text"
                  placeholder="Carousel Name"
                  name="name"
                  value={caroudata.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setCaroudata({ ...caroudata, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="carousel_image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  id="carousel_image"
                  type="file"
                  name="image"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setCaroudata({ ...caroudata, image: e.target.files[0] })}
                />
              </div>
              <div>
                <label htmlFor="carousel_link" className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                <input
                  id="carousel_link"
                  type="text"
                  placeholder="Link URL"
                  name="link"
                  value={caroudata.link}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setCaroudata({ ...caroudata, link: e.target.value })}
                />
              </div>
              {alert && <p className="text-red-500 text-sm mt-2">Please fill all required fields.</p>}
              <div className="modal-action mt-6">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                  Add Carousel
                </button>
                <button type="button" className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  onClick={() => document.getElementById("carousel_modal").close()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousel && Array.isArray(carousel) && carousel.length > 0 ? (
            carousel.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-blue-600 hover:underline text-sm truncate"><a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a></p>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-lg col-span-full">No carousels found. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}