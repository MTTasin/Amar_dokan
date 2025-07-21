import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist } from '../store/authSlice';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { wishlist, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Re-fetch wishlist if it's not already loaded or succeeded
    if (isAuthenticated && wishlist.status === 'idle') {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, wishlist.status, dispatch]);

  if (wishlist.status === 'loading') {
    return <Spinner />;
  }

  if (wishlist.items.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <Heart className="mx-auto h-24 w-24 text-text-secondary" />
        <h1 className="mt-8 text-4xl font-anton text-text-primary">Your Wishlist is Empty</h1>
        <p className="mt-4 text-text-secondary">You haven't saved any products yet. Browse our collection to find something you love!</p>
        <Link 
          to="/shop" 
          className="mt-8 inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">My Wishlist</h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-text-secondary">
          Your collection of saved items.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
