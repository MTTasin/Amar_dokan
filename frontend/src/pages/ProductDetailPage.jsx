import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, clearSelectedProduct, addProductReview, clearMutationStatus } from '../store/productsSlice';
import { addItemToCart } from '../store/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/authSlice';
import Spinner from '../components/Spinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ArrowLeft, Star, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';

// --- Sub-components for ProductDetailPage ---

const renderLeftNav = (onClick, disabled) => ( <button type="button" className="image-gallery-left-nav absolute top-1/2 -translate-y-1/2 left-4 z-10 p-3 bg-white/60 hover:bg-white/90 rounded-full shadow-md transition-colors disabled:opacity-50" disabled={disabled} onClick={onClick}><ChevronLeft size={24} className="text-brand-orange" /></button> );
const renderRightNav = (onClick, disabled) => ( <button type="button" className="image-gallery-right-nav absolute top-1/2 -translate-y-1/2 right-4 z-10 p-3 bg-white/60 hover:bg-white/90 rounded-full shadow-md transition-colors disabled:opacity-50" disabled={disabled} onClick={onClick}><ChevronRight size={24} className="text-brand-orange" /></button> );

// This component contains the full review system logic
const ProductTabs = ({ product }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('description');
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const { mutationStatus, mutationError } = useSelector(state => state.products);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    // This check prevents a user from reviewing a product more than once
    const userHasReviewed = useMemo(() => 
        product.reviews?.some(review => review.user.id === user?.id)
    , [product.reviews, user]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (rating > 0 && comment) {
            dispatch(addProductReview({ productId: product.id, reviewData: { rating, comment } }));
        }
    };

    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            setRating(0);
            setComment('');
            dispatch(clearMutationStatus());
        }
    }, [mutationStatus, dispatch]);

    const TabButton = ({ id, label }) => ( <button onClick={() => setActiveTab(id)} className={`px-6 py-3 font-semibold border-b-2 transition-colors ${ activeTab === id ? 'border-brand-orange text-brand-orange' : 'border-transparent text-text-secondary hover:text-text-primary' }`}>{label}</button> );

    return (
        <div className="mt-16">
            <div className="border-b border-border-light">
                <TabButton id="description" label="Description" />
                <TabButton id="reviews" label={`Reviews (${product.reviews?.length || 0})`} />
            </div>
            <div className="py-8">
                {activeTab === 'description' && ( <div className="prose max-w-none text-text-secondary"><p>{product.description || "No description available."}</p></div> )}
                {activeTab === 'reviews' && (
                    <div>
                        <h3 className="text-2xl font-semibold mb-6">Customer Reviews</h3>
                        {/* The review form is only shown to logged-in users who haven't reviewed yet */}
                        {isAuthenticated && !userHasReviewed && (
                            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
                                <h4 className="font-semibold mb-4">Write a Review</h4>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <Star
                                                key={starValue}
                                                size={24}
                                                className={`cursor-pointer transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                onClick={() => setRating(starValue)}
                                                onMouseEnter={() => setHoverRating(starValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            />
                                        );
                                    })}
                                </div>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." rows="4" className="w-full form-input" required></textarea>
                                {mutationError && <p className="text-red-500 text-sm mt-2">{mutationError}</p>}
                                <button type="submit" disabled={mutationStatus === 'loading'} className="mt-4 bg-brand-orange text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400">
                                    {mutationStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}
                        {/* This section displays all existing reviews */}
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {product.reviews.map(review => (
                                    <div key={review.id} className="border-b border-border-light pb-4">
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">{[...Array(5)].map((_, i) => ( <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} /> ))}</div>
                                            <p className="ml-4 font-bold text-text-primary">{review.user.name}</p>
                                        </div>
                                        <p className="text-text-secondary">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : ( <p className="text-text-secondary">No reviews yet. Be the first to review this product!</p> )}
                    </div>
                )}
            </div>
        </div>
    );
};

const RelatedProducts = ({ currentProduct }) => {
    const { items: allProducts } = useSelector((state) => state.products);
    const related = useMemo(() => {
        if (!currentProduct?.category || !allProducts.length) return [];
        return allProducts.filter(p => 
            p.category_name === currentProduct.category.name && p.id !== currentProduct.id
        ).slice(0, 4);
    }, [allProducts, currentProduct]);
    if (related.length === 0) return null;
    return (
        <div className="mt-20">
            <h2 className="text-3xl font-anton text-center text-text-primary mb-12">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {related.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};

// --- Main ProductDetailPage Component ---

const ProductDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();
    
    const { details: product, status, error } = useSelector((state) => state.products.selectedProduct);
    const { isAuthenticated, wishlist } = useSelector((state) => state.auth);

    const isWishlisted = useMemo(() => wishlist.items.some(item => item.id === product?.id), [wishlist.items, product]);

    useEffect(() => {
        if (productId) dispatch(fetchProductById(productId));
        return () => dispatch(clearSelectedProduct());
    }, [productId, dispatch]);

    const handleAddToCart = () => { if (product) dispatch(addItemToCart(product)); };
    
    const handleWishlistToggle = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (isWishlisted) {
            dispatch(removeFromWishlist(product.id));
        } else {
            const productForWishlist = {
                ...product,
                category_name: product.category.name,
                image_url: product.image
            };
            dispatch(addToWishlist({ productId: product.id, product: productForWishlist }));
        }
    };

    const galleryImages = useMemo(() => {
        if (!product?.image_url) return [];
        const mainImage = { original: product.image_url, thumbnail: product.image_url };
        const additionalImages = product.images?.map(img => ({ original: img.image, thumbnail: img.image })) || [];
        return [mainImage, ...additionalImages];
    }, [product]);

    if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    if (status === 'failed' || !product) return ( <div className="container mx-auto text-center py-20"> <h2 className="text-3xl font-bold text-text-primary">Product Not Found</h2> <p className="text-red-500 mt-2">{error}</p> <Link to="/shop" className="mt-4 inline-block text-brand-orange hover:underline">&larr; Back to Shop</Link> </div> );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8"> <Link to="/shop" className="flex items-center gap-2 text-text-secondary hover:text-brand-orange transition-colors"> <ArrowLeft size={18} /> Back to Collection </Link> </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="bg-white rounded-lg shadow-md border border-border-light p-4"> <ImageGallery items={galleryImages} showPlayButton={false} showFullscreenButton={true} thumbnailPosition="bottom" renderLeftNav={renderLeftNav} renderRightNav={renderRightNav} /> </div>
                <div>
                    <p className="text-brand-orange font-semibold">{product.category.name}</p>
                    <h1 className="text-4xl md:text-5xl font-anton uppercase text-text-primary my-4">{product.name}</h1>
                    <p className="text-4xl font-bold text-brand-orange mb-6">${parseFloat(product.price).toFixed(2)}</p>
                    
                    <div className="space-y-4 mb-6">
                        {product.colors?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold uppercase text-text-secondary mb-2">Color</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map(color => (
                                        <div key={color.id} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: color.hex_code }} title={color.name}></div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product.sizes?.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold uppercase text-text-secondary mb-2">Size</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <div key={size.id} className="px-3 py-1 border-2 rounded-md text-sm">{size.name}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <p className="mb-6 text-sm"> {product.stock_quantity > 0 ? <span className="text-green-600 font-semibold">In Stock ({product.stock_quantity} left)</span> : <span className="text-red-600 font-semibold">Out of Stock</span>} </p>
                    
                    <div className="flex items-center gap-4">
                        <button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="bg-brand-orange text-white font-bold py-3 px-10 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">Add to Cart</button>
                        <button onClick={handleWishlistToggle} className="p-3 border-2 border-border-light rounded-lg text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors" aria-label="Toggle Wishlist"> <Heart size={24} className={isWishlisted ? 'text-red-500 fill-current' : ''} /> </button>
                    </div>
                </div>
            </div>
            <ProductTabs product={product} />
            <RelatedProducts currentProduct={product} />
        </div>
    );
};

ProductTabs.defaultProps = { product: { reviews: [] } };
RelatedProducts.defaultProps = { currentProduct: null };

export default ProductDetailPage;
