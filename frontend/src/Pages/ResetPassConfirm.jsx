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

    if (e.target.name === "re_new_password" || e.target.name === "new_password") {
      if (formData.new_password !== e.target.value) {
        setWrongPassword(true);
      } else {
        setWrongPassword(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new_password !== re_new_password) {
      toast.error("Passwords do not match");
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLoading && (
        <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gray-50 bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.png"
            alt="Amar Dokan Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set a new password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-px">
            <div>
              <input
                id="new_password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={new_password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="re_new_password"
                name="re_new_password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                value={re_new_password}
                onChange={handleChange}
              />
            </div>
          </div>

          {wrongPassword && (
            <p className="text-red-500 text-sm text-center">Passwords do not match</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassConfirm;
