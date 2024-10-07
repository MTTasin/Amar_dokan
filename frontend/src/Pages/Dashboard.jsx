import { getUserInfo } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader/Loader";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const { user, userInfo } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);


  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    axios
      .get("http://192.168.0.105:8000/products/", {
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="relative">
        {loading && (
          <div className="flex justify-center items-center h-[80vh] w-[100vw] z-10 absolute">
            <Loader />
          </div>
        )}
        <div className={loading ? "opacity-10 z-0" : "my-auto"}>
          <h1>Dashboard</h1>
          <p>Welcome {userInfo.first_name} {userInfo.last_name}</p>
          <p>total products: {products.length}</p>
        </div>
      </div>
    </>
  );
}
