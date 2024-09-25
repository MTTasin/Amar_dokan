import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  register,
  reset,
  getUserInfo,
} from "../features/auth/authslice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";


export default function RegisterForm() {
    const navigateReg = useNavigate();
  const dispatchReg = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [passMatch, setPassMatch] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { first_name, last_name, email, password, re_password } = formData;
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.re_password) {
      alert("Passwords do not match");
      return;
    } else {
      const userData = {
        first_name,
        last_name,
        email,
        password,
        re_password
    }
      dispatchReg(register(userData));
    }
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigateReg("/");
      toast.success("Registration Successful, An activation link has been sent to your email");
    } else if (isError) {
      toast.error(message);
    }

    dispatchReg(reset());
    }, [user, isError, isSuccess, message, navigateReg, dispatchReg]
  );

  const handlePassMatch = () => {
    if (formData.password !== formData.re_password) {
      setPassMatch(true);
    } else if (formData.password === "" || formData.re_password === "") {
      setPassMatch(false);
    } else {
      setPassMatch(false);
    }
  };

    return(
        <div>
          <div className="flex flex-col items-center"><img src="/logo.png" alt="" className="w-24" /></div>
          <h2 className="text-center text-3xl font-bold mb-7 mt-4">Sign Up</h2>
          <div className="flex flex-col items-center">
            <form
              className="flex flex-col gap-3 w-full max-w-md"
              onSubmit={event => handleSubmit(event)}
            >
              <input
                type="text"
                name="first_name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="First Name"
              />
              <input
                type="text"
                name="last_name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full signUpPass"
                placeholder="Password"

              />
              <input
                type="password"
                name="re_password"
                value={formData.re_password}
                onChange={handleChange}
                className="input input-bordered w-full signUpPass"
                placeholder="Repeat Password"
                onKeyUp={handlePassMatch}
                
              />
              
              <h4 className="text-red-500 text-center">
                {passMatch ? "Passwords do not match" : ""}
              </h4>
              <button type="submit" className="btn btn-primary">
                Signup
              </button>

              <Link to="/login" className="text-center cursor-pointer mx-auto">
                Already have an account? Login
              </Link>
            </form>
          </div>
        </div>
    )

}