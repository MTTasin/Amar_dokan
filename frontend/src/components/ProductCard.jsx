import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addItemToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/authSlice';
import { Plus, Heart, Star } from 'lucide-react';

// NEW: A small component to render the star rating
const StarRating = ({ rating, count }) => {
  const totalStars = 5;
  const fullStars = Math.round(rating || 0);
  
  if (!count || count === 0) {
    return <div className="h-5"></div>; // Reserve space but show nothing if no reviews
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
      <span className="text-xs text-text-secondary">({count})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, wishlist } = useSelector((state) => state.auth);
  const isWishlisted = wishlist.items.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItemToCart(product));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist({ productId: product.id, product }));
    }
  };

  const renderTag = () => {
    if (!product.tag) return null;
    let bgColor = 'bg-blue-500';
    if (product.tag === 'new') bgColor = 'bg-green-500';
    if (product.tag === 'hot') bgColor = 'bg-red-500';
    return (
        <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 uppercase ${bgColor}`}>
            {product.tag}
        </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden group flex flex-col shadow-md border border-border-light transition-shadow duration-300 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="relative overflow-hidden block">
        {renderTag()}
        
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 bg-white p-2 rounded-full z-10 opacity-80 group-hover:opacity-100 transition-opacity"
          aria-label="Toggle Wishlist"
        >
          <Heart size={18} className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-500'} />
        </button>

        <img 
          src={product.image_url} 
          alt={product.name}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x500/F36523/1a1a1a?text=Image+Not+Found'; }}
          className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 group-hover:scale-110" 
        />
      </Link>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <p className="text-xs sm:text-sm text-text-secondary mb-1">{product.category_name}</p>
          <h3 className="text-sm sm:text-base font-semibold text-text-primary truncate group-hover:text-brand-orange transition-colors mb-1">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          {/* NEW: Added the StarRating component */}
          <StarRating rating={product.avg_rating} count={product.reviews_count} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-base sm:text-lg font-bold text-brand-orange">৳{parseFloat(product.price).toFixed(2)}</p>
          <button 
            onClick={handleAddToCart}
            className="bg-gray-200 text-text-primary p-2 rounded-full text-sm hover:bg-brand-orange hover:text-white transition-colors duration-300 shrink-0"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
