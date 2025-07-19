import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset, getUserInfo } from "../features/auth/authslice.jsx";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
    toast.success("Logout Successful");
  };

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><NavLink to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Home</NavLink></li>
              <li><NavLink to="/AllProducts" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Products</NavLink></li>
              <li><NavLink to="/About" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">About</NavLink></li>
              <li><NavLink to="/Carousel_edit" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Edit Carousel</NavLink></li>
            </ul>
          </div>
          <NavLink to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Amar Dokan" className="h-10" />
            <span className="text-xl font-bold text-gray-800">Amar Dokan</span>
          </NavLink>
        </div>

        <nav className="hidden lg:flex space-x-6">
          <NavLink to="/" className="text-gray-600 hover:text-gray-900 transition duration-300">Home</NavLink>
          <NavLink to="/AllProducts" className="text-gray-600 hover:text-gray-900 transition duration-300">Products</NavLink>
          <NavLink to="/About" className="text-gray-600 hover:text-gray-900 transition duration-300">About</NavLink>
          
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <FaSearch className="h-5 w-5" />
            </button>
            {searchOpen && (
              <form onSubmit={handleSearch} className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="hidden">Search</button>
              </form>
            )}
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <CgProfile className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
              <li>
                {user ? (
                  <NavLink to="/profile" className="block px-4 py-2 bg-white text-gray-800 hover:bg-gray-200">
                    {userInfo.first_name} {userInfo.last_name}
                  </NavLink>
                ) : (
                  <span className="block px-4 py-2 text-gray-800">Guest user</span>
                )}
              </li>
              {user && (
                <li>
                  <NavLink to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Dashboard</NavLink>
                </li>
              )}
              <li>
                {user ? (
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</button>
                ) : (
                  <NavLink to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Login</NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
