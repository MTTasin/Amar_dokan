import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { resetPasswordConfirm } from "../features/auth/authslice";
import Loader from "../Components/Loader/Loader";

function ResetPassConfirm() {
    const [wrongPassword, setWrongPassword] = useState(false);
  const { uid, token } = useParams();
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (new_password !== re_new_password) {
      setWrongPassword(true);
    } else {
      setWrongPassword(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      uid,
      token,
      new_password,
      re_new_password,
    };

    dispatch(resetPasswordConfirm(userData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      navigate("/login");
      toast.success("Your password was reset successfully.");
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
          <h1 className="text-3xl font-bold text-center my-10">Set New Password</h1>
          <form className="flex flex-col items-center justify-center">
            <input
              type="password"
              placeholder="New password"
              name="new_password"
              onChange={handleChange}
              value={new_password}
              required
              className="input input-bordered w-full max-w-xs mb-5"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              name="re_new_password"
              onChange={handleChange}
              value={re_new_password}
              required
              className="input input-bordered w-full max-w-xs mb-5"
            />

            {wrongPassword && (
              <p className="text-red-500 text-center">Passwords do not match</p>
            )}
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

export default ResetPassConfirm;
