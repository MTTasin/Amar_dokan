import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-gray-900 tracking-tight animate-bounce">
          404
        </h1>
        <p className="mt-2 text-4xl font-semibold text-gray-800">
          Page Not Found
        </p>
        <p className="mt-2 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}