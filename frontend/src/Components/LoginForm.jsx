import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useState } from "react"


export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/accounts/google/login/", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      window.location.reload();
    } catch (err) {
      setError(err.response.data.detail)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://127.0.0.1:8000/accounts/login/", {
        email,
        password
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      window.location.reload();
    } catch (err) {
      setError(err.response.data.detail)
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" placeholder="Password" />
        <button type="submit" className="btn btn-primary">Login</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <GoogleLogin onSuccess={handleLogin} onError={() => setError('Failed to login with Google')} />
    </div>
  )
}








{/* <div>
<h1 className="text-3xl text-center mb-5">Login</h1>
<form className="form w-50 flex flex-col gap-5 mx-auto">
    <input type="text" name="email" className="form-control mb-3 p-3 rounded-md" placeholder="Email"/>
    <input type="password" className="form-control mb-3 p-3 rounded-md" placeholder="Password"/>
    <button className="btn btn-primary" type="submit">Login</button>
    
    <button className="btn btn-primary" type="submit" onClick={googleLogin}>Google Login</button>
    
</form>
</div> */}