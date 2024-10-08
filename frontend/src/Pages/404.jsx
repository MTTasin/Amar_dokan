import { Link } from "react-router-dom";

export default function NotFound() {
    return(
        <>
            <div className="text-9xl font-bold text-center text-red-500 mt-10 mb-10">404</div>
            <div className="text-3xl font-bold text-center text-red-500">Page not found</div>
            <Link to="/" className="flex justify-center"><button className="btn btn-accent text-3xl font-bold text-center text-black mt-10">Back to Home</button></Link>
        </>
    );
}