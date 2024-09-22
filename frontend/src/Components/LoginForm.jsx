import axios from "axios";
import { useState } from "react";


export default function LoginForm() {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
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
    console.log(formData);
  };

  return (
    <>
      {login ? (
        <div>
          <div className="flex flex-col items-center">
            <form className="flex flex-col gap-5 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Password"
              />
              <button type="submit" className="btn btn-primary">
                Login
              </button>

              <a className="text-center cursor-pointer" onClick={() => setLogin(false)}>
                {" "}
                Don't have an account? Sign up
              </a>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col items-center">
            <form
              className="flex flex-col gap-5 w-full max-w-md"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Name"
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
                {" "}
                Already have an account? Login
              </a>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <div>
<h1 className="text-3xl text-center mb-5">Login</h1>
<form className="form w-50 flex flex-col gap-5 mx-auto">
    <input type="text" name="email" className="form-control mb-3 p-3 rounded-md" placeholder="Email"/>
    <input type="password" className="form-control mb-3 p-3 rounded-md" placeholder="Password"/>
    <button className="btn btn-primary" type="submit">Login</button>
    
    <button className="btn btn-primary" type="submit" onClick={googleLogin}>Google Login</button>
    
</form>
</div> */
}
