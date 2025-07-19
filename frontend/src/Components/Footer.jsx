import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold font-abu mb-4">Amar Dokan</h1>
          <p className="text-gray-400 text-sm">Your one-stop shop for everything you need.</p>
        </div>

        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul>
            <li className="mb-2"><Link to="/AllProducts" className="text-gray-400 hover:text-white transition duration-300">Shop</Link></li>
            <li className="mb-2"><Link to="/About" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
            <li className="mb-2"><Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
          </ul>
        </div>

        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Support</h2>
          <ul>
            <li className="mb-2 text-gray-400">Chittagong, Bangladesh</li>
            <li className="mb-2 text-gray-400">+8801974283081</li>
            <li className="mb-2 text-gray-400">m.t.tasin20@gmail.com</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaFacebook className="text-2xl" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaTwitter className="text-2xl" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaYoutube className="text-2xl" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaInstagram className="text-2xl" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Amar Dokan. All Rights Reserved.
      </div>
    </footer>
  );
}
