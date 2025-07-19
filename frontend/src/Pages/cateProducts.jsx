import { useParams } from "react-router-dom";
import useAxios from "../useAxios";
import Card from "../Components/Card";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader/Loader";

export default function CateProducts() {
  const params = useParams();

  const { response: data, error, loading } = useAxios(`${process.env.VITE_API_BASE_URL}/products/?category=${params.category}`);

  const CardData = data && Array.isArray(data) ? data.map((product) => {
    return (
      <Card
        key={product.id}
        id={product.id}
        title={product.title}
        img={product.thumbnail}
        price={product.price}
        tags={product.tags}
        rating={product.rating}
      />
    );
  }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-gray-50 bg-opacity-75 z-50">
          <Loader />
        </div>
      )}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-sm breadcrumbs mb-6 text-gray-600">
            <ul>
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-800 font-semibold capitalize">{params.category}</span></li>
            </ul>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 text-center mb-10 capitalize">{params.category} Products</h1>

          {error && <div className="text-center text-red-500 mb-4">Error: {error.message}</div>}
          {!data || data.length === 0 && !loading && !error ? (
            <div className="text-center text-gray-600 text-lg">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {CardData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
