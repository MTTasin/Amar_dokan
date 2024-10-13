import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="text-center py-10">
      <div className="p-4 mt-4 text-white bg-base-300 grid grid-cols-2 md:grid-cols-5">
        <div className="mt-4">
          <h1 className="text-4xl">Amar Dokan</h1>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Exclusive</h2>
          <ul className="">
            <li className="mt-2">Subscribe</li>
            <li className="mt-2"><input type="email" placeholder="Enter your email" className="input input-bordered" /></li>
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Support</h2>
          <ul className="">
            <li className="mt-2">Chittagong, Bangladesh</li>
            <li className="mt-2">+8801974283081</li>
            <li className="mt-2">m.t.tasin20@gmail.com</li>
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Account</h2>
          <ul className="">
            <li className="mt-2">Profile</li>
            <li className="mt-2">Orders</li>
            <li className="mt-2">Wishlist</li>
            <li className="mt-2">Cart</li>
          </ul>
        </div>
        <div className="mt-4 col-span-2 md:col-span-1">
          <h2 className="text-2xl">Quick Links</h2>
          <div className="flex justify-evenly mt-2">
            <FaFacebook />
            <FaTwitter />
            <FaYoutube />
            <FaInstagram />
          </div>
        </div>
      </div>
      <hr />
      <div>
        © 2022 Copyright:{" "}
        <a className="text-white" href="https://tasinblog.com">
          M.T.Tasin
        </a>{" "}
        | All Rights Reserved
      </div>
    </footer>
    );
}