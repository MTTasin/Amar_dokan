import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, reset, getUserInfo } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader/Loader";

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
        re_password,
      };
      dispatchReg(register(userData));
    }
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigateReg("/");
      toast.success(
        "Registration Successful, An activation link has been sent to your email"
      );
    } else if (isError) {
      toast.error(message);
    }

    dispatchReg(reset());
  }, [user, isError, isSuccess, message, navigateReg, dispatchReg]);

  const handlePassMatch = () => {
    if (formData.password !== formData.re_password) {
      setPassMatch(true);
    } else if (formData.password === "" || formData.re_password === "") {
      setPassMatch(false);
    } else {
      setPassMatch(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="flex justify-center items-center h-[80vh] w-[100vw] z-10 absolute">
          <Loader />
        </div>
      )}
      <div className={isLoading ? "opacity-10 z-0" : "my-auto"}>
        <div className="grid grid-cols-5 place-items-center">
          <div className="col-span-3 md:block hidden mx-auto">
            <img src="/login.png" alt="" className="w-[50vw]" />
          </div>
          <div className="col-span-5 md:col-span-2">
            <div className="flex flex-col items-center">
              <form>
                <h2 className="text-center text-3xl mb-7 mt-4">
                  SignUp to Amar Dokan
                </h2>
                <div className="flex flex-col gap-3 w-full ">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="input input-bordered w-full"
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="input input-bordered w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input input-bordered w-full"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="input input-bordered w-full"
                  />
                  <input
                    type="password"
                    name="re_password"
                    value={formData.re_password}
                    onChange={handleChange}
                    onKeyUp={handlePassMatch}
                    placeholder="Re enter password"
                    className="input input-bordered w-full"
                  />

                  {passMatch && (
                    <p className="text-red-500">Passwords do not match</p>
                  )}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </button>
                  <p className="text-center">Already have an account ? {" "}
                    <Link to="/login" className="text-blue-500">Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
