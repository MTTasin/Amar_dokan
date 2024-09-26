import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader/Loader";
import { resetPassword } from "../features/auth/authslice";

function ResetPass() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
    };

    dispatch(resetPassword(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      navigate("/");
      toast.success("A reset password email has been sent to you.");
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <>
      <div className="relative">
        {isLoading && (
          <div className="flex justify-center items-center h-[80vh] w-[100vw] z-10 absolute">
            <Loader />
          </div>
        )}
        <div className={isLoading ? "opacity-10 z-0" : "my-auto"}>
        <h1 className="text-3xl text-center mb-10 mt-10 font-bold">Reset Password</h1>
          <form className="flex flex-col items-center">
            <input
              type="text"
              placeholder="email"
              name="email"
              onChange={handleChange}
              value={email}
              required
              className="input input-bordered w-full max-w-xs mb-5"
            />

            <button
              className="btn btn-primary w-full max-w-xs mb-5"
              type="submit"
              onClick={handleSubmit}
            >
              Reset Password
            </button>
            <button className="btn btn-secondary w-full max-w-xs mb-5">
                <Link to="/login">Back to login page.</Link>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResetPass;
