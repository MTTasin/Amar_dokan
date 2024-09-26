import { Link } from "react-router-dom";

export default function NotFound() {
    return(
        <>
            <div className="text-9xl font-bold text-center text-red-500 mt-10 mb-10">404</div>
            <div className="text-3xl font-bold text-center text-red-500">Page not found</div>
            <Link to="/" className="text-3xl font-bold text-center text-red-500">Back to Home</Link>
        </>
    );
}