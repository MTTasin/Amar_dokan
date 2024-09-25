import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  reset,
  getUserInfo,
} from "../features/auth/authslice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

function LoginForm() {
  const [loginstate, setLoginstate] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  
 console.log(loginFormData)

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: loginFormData.email,
      password: loginFormData.password,
    };

    dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/");
      toast.success("Login Successful");
    }

    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
    dispatch(getUserInfo());
  }, [user, isError, isSuccess, navigate, dispatch]);

  return (
    <>
      <div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="" className="w-24" />
          </div>
          <h2 className="text-center text-3xl font-bold mb-7 mt-4">Login</h2>
          <form
            onSubmit={(e) => handleLoginSubmit(e)}
            className="flex flex-col gap-3 w-full max-w-md"
          >
            <input
              type="email"
              value={loginFormData.email}
              onChange={(e) =>
                setLoginFormData({ ...loginFormData, email: e.target.value })
              }
              className="input input-bordered w-full"
              placeholder="Email"
            />
            <input
              type="password"
              value={loginFormData.password}
              onChange={(e) =>
                setLoginFormData({
                  ...loginFormData,
                  password: e.target.value,
                })
              }
              className="input input-bordered w-full"
              placeholder="Password"
            />
            <button type="submit" className="btn btn-primary">
              Login
            </button>

            <Link
              to="/reset_password"
              className="text-center cursor-pointer mx-auto"
            >
              Forgot Password
            </Link>
            <div className="text-center cursor-pointer mx-auto">
              <Link to="/signup">Don't have an account? Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
