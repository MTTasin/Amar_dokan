import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";


function LoginForm() {
  const [login, setLogin] = useState(true);
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });
  const [passMatch, setPassMatch] = useState(false);

  const handlePassMatch = () => {
    if (formData.password !== formData.re_password) {
      setPassMatch(true);
    } else if (formData.password === "" || formData.re_password === "") {
      setPassMatch(false);
    } else {
      setPassMatch(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.re_password) {
      alert("Passwords do not match");
      return;
    }
    
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
  };

  function forPass() {
    document.getElementById("login").close();
  }

  return (
    <>
    <dialog id="login" className="modal">
    <div className="modal-box">
      {login ? (
        <div>
          <div className="flex flex-col items-center">
            <form onSubmit={event => handleLoginSubmit(event)} className="flex flex-col gap-5 w-full max-w-md">
              <input
                type="email"
                value={loginFormData.email}
                onChange={(e) => setLoginFormData({ ...loginFormData, email: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              <input
                type="password"
                value={loginFormData.password}
                onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Password"
              />
              <button type="submit" className="btn btn-primary">
                Login
              </button>

              <Link to="/reset_password" className="text-center cursor-pointer" onClick={forPass}>
                Forgot your password?
              </Link>
              <p className="text-center cursor-pointer" onClick={() => setLogin(false)}>
                Don't have an account? Sign up
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center">
            <form
              className="flex flex-col gap-5 w-full max-w-md"
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
                className="input input-bordered w-full"
                placeholder="Password"
              />
              <input
                type="password"
                name="re_password"
                value={formData.re_password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Repeat Password"
                onKeyUp={handlePassMatch}
              />
              <h4 className="text-red-500">
                {passMatch ? "Passwords do not match" : ""}
              </h4>
              <button type="submit" className="btn btn-primary">
                Signup
              </button>

              <a className="text-center cursor-pointer" onClick={() => setLogin(true)}>
                Already have an account? Login
              </a>
            </form>
          </div>
        </div>
      )}

</div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
    </>
  );
}

export default LoginForm;