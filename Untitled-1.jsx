// package.json




{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "homepage": "https://mttasin.github.io/Amar_dokan/",
  "type": "module",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.8.2",
    "@tailwindcss/vite": "^4.1.11",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-image-gallery": "^1.4.0",
    "react-redux": "^9.2.0",
    "react-router-dom": "^7.6.3",
    "swiper": "^11.2.10",
    "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.29.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "eslint": "^9.29.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "gh-pages": "^6.3.0",
    "globals": "^16.2.0",
    "vite": "^7.0.0"
  }
}








// Footer.jsx



import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Truck, LifeBuoy, CreditCard } from 'lucide-react';

const Footer = () => {
  const { items: allCategories } = useSelector((state) => state.categories);

  const facilities = [
    { icon: <Truck size={30} />, text: 'Free Shipping', subtext: 'On orders over $50' },
    { icon: <LifeBuoy size={30} />, text: '24/7 Support', subtext: 'Dedicated support' },
    { icon: <CreditCard size={30} />, text: 'Secure Payments', subtext: 'SSL Encrypted' },
  ];

  return (
    <footer className="bg-white text-text-secondary border-t border-border-light">
      {/* Facilities Section */}
      <div className="bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {facilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-center gap-4">
                    <div className="text-brand-orange">{facility.icon}</div>
                    <div>
                        <h4 className="font-semibold text-text-primary">{facility.text}</h4>
                        <p className="text-sm">{facility.subtext}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-anton text-text-primary mb-4">THE প্রফেসর</h3>
            <p className="text-sm">Crafting the uniform for the modern intellectual.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-brand-orange text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange text-sm transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-orange text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-brand-orange text-sm transition-colors">All Products</Link></li>
              {allCategories.slice(0, 4).map(category => (
                <li key={category.id}>
                  <Link to={`/shop?category=${category.slug}`} className="hover:text-brand-orange text-sm transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Instagram size={24}/></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Facebook size={24}/></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Twitter size={24}/></a>
            </div>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="border-t border-border-light pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} The প্রফেসর. All Rights Reserved.</p>
          <p className="mt-2">
            Developed with ❤️ by <a href="mailto:m.t.tasin20@gmail.com" className="font-semibold text-brand-orange hover:underline">M.T. Tasin</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;











// Header.jsx



import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ShoppingCart, User as UserIcon, Heart, ChevronDown } from 'lucide-react';
import { toggleMenu, closeMenu } from '../store/uiSlice';
import { logout } from '../store/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMenuOpen } = useSelector((state) => state.ui);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated, user, wishlist } = useSelector((state) => state.auth);
  const { logo_url } = useSelector((state) => state.site.config);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    dispatch(closeMenu());
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleNavClick();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeLinkStyle = { color: '#F36523' };

  const AuthLinks = () => {
    if (isAuthenticated) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-brand-orange transition-colors duration-300"
          >
            <UserIcon size={18} />
            <span className="hidden sm:inline">Hi, {user?.name.split(' ')[0]}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-border-light">
              <Link to="/dashboard" onClick={handleNavClick} className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100">
                My Account
              </Link>
              {user?.is_staff && (
                <Link to="/admin" onClick={handleNavClick} className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100">
                  Admin Dashboard
                </Link>
              )}
              <div className="border-t border-border-light my-1"></div>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <NavLink 
        to="/login" 
        className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-brand-orange transition-colors duration-300"
      >
        <UserIcon size={18} />
        <span className="hidden sm:inline">Login</span>
      </NavLink>
    );
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 left-0 right-0 z-50 border-b border-border-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" onClick={handleNavClick} className="flex-shrink-0">
            <img src={logo_url || "https://i.imgur.com/K9b2uFj.png"} alt="The প্রফেসর Logo" className="h-12 w-auto" />
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavLink 
                key={link.name} to={link.path}
                className="text-sm font-medium text-text-primary hover:text-brand-orange transition-colors duration-300"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                {link.name.toUpperCase()}
              </NavLink>
            ))}
          </nav>

          {/* Icons and Auth */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <AuthLinks />
              <div className="h-6 border-l border-border-light"></div>
            </div>
            
            <Link to="/wishlist" title="Wishlist" className="relative p-2 text-text-primary hover:text-brand-orange transition-colors duration-300">
                <Heart size={22} />
                {isAuthenticated && wishlist.items.length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center transform -translate-y-1/4 translate-x-1/4">
                        {wishlist.items.length}
                    </span>
                )}
            </Link>

            <NavLink to="/cart" title="Shopping Cart" className="relative p-2 text-text-primary hover:text-brand-orange transition-colors duration-300">
              <ShoppingCart size={24} />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                  {totalQuantity}
                </span>
              )}
            </NavLink>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => dispatch(toggleMenu())} className="p-2 text-text-primary hover:text-brand-orange">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white pb-4 absolute top-20 left-0 w-full border-t border-border-light">
          <nav className="flex flex-col items-center space-y-4 pt-4">
            {navLinks.map(link => (
              <NavLink key={link.name} to={link.path} onClick={handleNavClick}
                className="text-lg font-medium text-text-primary hover:text-brand-orange transition-colors duration-300">
                {link.name}
              </NavLink>
            ))}
            <div className="mt-4 pt-4 border-t border-border-light w-11/12 text-center sm:hidden">
                <AuthLinks />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;











// Layout.jsx





// components/Layout.jsx


import React from 'react';

// We will create these components in the next steps
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="bg-background-light text-text-primary font-inter">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;










// ProductCard.jsx







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










// Spinner.jsx





import React from 'react';
import { Loader } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex flex-col items-center">
        <Loader className="animate-spin text-brand-orange h-12 w-12" />
        <p className="mt-4 text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;














// AdminAttributesPage.jsx






import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchColors, createColor, deleteColor,
    fetchSizes, createSize, deleteSize,
    clearMutationStatus
} from '../../store/filtersSlice';
import Spinner from '../../components/Spinner';
import { Trash2 } from 'lucide-react';

// Reusable component for managing a list of attributes (Color or Size)
const AttributeManager = ({ title, items, onAdd, onDelete, mutationStatus, children }) => (
    <div className="p-6 border border-border-light rounded-lg">
        <h3 className="text-xl font-bold text-text-primary mb-4">{title}</h3>
        <form onSubmit={onAdd} className="flex gap-2 mb-4">
            {children}
            <button type="submit" disabled={mutationStatus === 'loading'} className="bg-brand-orange text-white font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                {mutationStatus === 'loading' ? 'Adding...' : 'Add'}
            </button>
        </form>
        <div className="space-y-2 max-h-60 overflow-y-auto">
            {items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                        {item.hex_code && <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: item.hex_code }}></div>}
                        <span className="text-sm">{item.name}</span>
                    </div>
                    <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);


const AdminAttributesPage = () => {
    const dispatch = useDispatch();
    const { colors, sizes, mutationStatus, mutationError } = useSelector(state => state.filters);

    const [newColorName, setNewColorName] = useState('');
    const [newColorHex, setNewColorHex] = useState('#000000');
    const [newSizeName, setNewSizeName] = useState('');

    useEffect(() => {
        // Clear any previous errors when the component loads
        dispatch(clearMutationStatus());
    }, [dispatch]);

    const handleAddColor = (e) => {
        e.preventDefault();
        if (newColorName && newColorHex) {
            dispatch(createColor({ name: newColorName, hex_code: newColorHex }));
            setNewColorName('');
            setNewColorHex('#000000');
        }
    };

    const handleAddSize = (e) => {
        e.preventDefault();
        if (newSizeName) {
            dispatch(createSize({ name: newSizeName }));
            setNewSizeName('');
        }
    };

    const handleDeleteColor = (id) => {
        if (window.confirm('Are you sure you want to delete this color?')) {
            dispatch(deleteColor(id));
        }
    };

    const handleDeleteSize = (id) => {
        if (window.confirm('Are you sure you want to delete this size?')) {
            dispatch(deleteSize(id));
        }
    };

    return (
        <div>
            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Attributes</h2>
                <p className="text-sm text-text-secondary mt-1">Add or remove colors and sizes available for products.</p>
            </div>

            {mutationStatus === 'failed' && <p className="text-red-500 text-sm mb-4">Error: {mutationError}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Color Manager */}
                <AttributeManager
                    title="Colors"
                    items={colors.items}
                    onAdd={handleAddColor}
                    onDelete={handleDeleteColor}
                    mutationStatus={mutationStatus}
                >
                    <input
                        type="text"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        placeholder="Color Name (e.g., Blue)"
                        className="form-input w-full"
                        required
                    />
                    <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="form-input p-1 h-10 w-12"
                    />
                </AttributeManager>

                {/* Size Manager */}
                <AttributeManager
                    title="Sizes"
                    items={sizes.items}
                    onAdd={handleAddSize}
                    onDelete={handleDeleteSize}
                    mutationStatus={mutationStatus}
                >
                    <input
                        type="text"
                        value={newSizeName}
                        onChange={(e) => setNewSizeName(e.target.value)}
                        placeholder="Size Name (e.g., XL)"
                        className="form-input w-full"
                        required
                    />
                </AttributeManager>
            </div>
        </div>
    );
};

export default AdminAttributesPage;












// AdminCategoryList.jsx




import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    clearMutationStatus
} from '../../store/categoriesSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminCategoryList = () => {
    const dispatch = useDispatch();
    const { items: categories, status, mutationStatus, mutationError } = useSelector(state => state.categories);

    // State for the form (for both creating and editing)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        dispatch(clearMutationStatus());
    }, [dispatch]);

    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            closeForm();
        }
    }, [mutationStatus]);

    const openFormForCreate = () => {
        setIsEditMode(false);
        setCurrentCategory(null);
        setFormData({ name: '' });
        setImageFile(null);
        setImagePreview('');
        setIsFormOpen(true);
    };

    const openFormForEdit = (category) => {
        setIsEditMode(true);
        setCurrentCategory(category);
        setFormData({ name: category.name });
        setImageFile(null);
        setImagePreview(category.image_url || '');
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        dispatch(clearMutationStatus());
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect existing products.')) {
            dispatch(deleteCategory(categoryId));
        }
    };

    // NEW: Handler for the featured toggle switch
    const handleFeatureToggle = (category) => {
        const categoryFormData = new FormData();
        categoryFormData.append('name', category.name); // Name is required by the serializer
        categoryFormData.append('is_featured', !category.is_featured);
        // We don't need to send the image again for a simple toggle
        dispatch(updateCategory({ categoryId: category.id, categoryFormData }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryFormData = new FormData();
        categoryFormData.append('name', formData.name);
        if (imageFile) {
            categoryFormData.append('image', imageFile);
        }
        // Also send the featured status from the form if editing
        if (isEditMode && currentCategory) {
            categoryFormData.append('is_featured', currentCategory.is_featured);
        }

        if (isEditMode) {
            dispatch(updateCategory({ categoryId: currentCategory.id, categoryFormData }));
        } else {
            dispatch(createCategory(categoryFormData));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-6">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Category Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 w-full form-input" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Category Image (Optional)</label>
                                <input type="file" onChange={handleImageChange} className="mt-1 w-full" accept="image/*" />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-24 w-auto rounded-lg" />}
                            </div>
                            {mutationStatus === 'failed' && <p className="text-red-500 text-sm">Error: {mutationError}</p>}
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={closeForm} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" disabled={mutationStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                                    {mutationStatus === 'loading' ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Categories</h2>
                <button
                    onClick={openFormForCreate}
                    className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusCircle size={20} />
                    Add Category
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-lg object-cover bg-gray-100" src={category.image_url || 'https://placehold.co/100x100/EFEFEF/333?text=No+Img'} alt={category.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{category.name}</div>
                                        </div>
                                    </div>
                                </td>
                                {/* NEW: Featured Toggle Switch */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label htmlFor={`featured-${category.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id={`featured-${category.id}`} 
                                                className="sr-only" 
                                                checked={category.is_featured}
                                                onChange={() => handleFeatureToggle(category)}
                                            />
                                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${category.is_featured ? 'translate-x-4 !bg-brand-orange' : ''}`}></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openFormForEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategoryList;















// AdminHeroSlides.jsx




import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    clearMutationStatus
} from '../../store/heroSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

// --- Form Modal Component ---
const SlideFormModal = ({ slide, onClose, onSave, mutationStatus }) => {
    const [formData, setFormData] = useState({
        title: slide?.title || '',
        subtitle: slide?.subtitle || '',
        button_text: slide?.button_text || 'Shop Now',
        button_link: slide?.button_link || '/shop',
        is_active: slide?.is_active ?? true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(slide?.background_image_url || '');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const slideFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            slideFormData.append(key, value);
        });
        if (imageFile) {
            slideFormData.append('background_image', imageFile);
        }
        onSave(slide?.id, slideFormData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-6">{slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Subtitle</label>
                            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Button Text</label>
                            <input type="text" name="button_text" value={formData.button_text} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Button Link</label>
                            <input type="text" name="button_link" value={formData.button_link} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Background Image</label>
                        <input type="file" onChange={handleImageChange} className="mt-1 w-full" accept="image/*" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto rounded-lg object-cover" />}
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                            Active
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" disabled={mutationStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                            {mutationStatus === 'loading' ? 'Saving...' : 'Save Slide'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main List Component ---
const AdminHeroSlides = () => {
    const dispatch = useDispatch();
    const { slides, status, mutationStatus } = useSelector(state => state.hero);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    useEffect(() => {
        // Fetch slides if not already loaded
        if (status === 'idle') {
            dispatch(fetchHeroSlides());
        }
    }, [status, dispatch]);
    
    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            setIsFormOpen(false);
            setEditingSlide(null);
            dispatch(clearMutationStatus());
        }
    }, [mutationStatus, dispatch]);

    const handleSave = (slideId, slideFormData) => {
        if (slideId) {
            dispatch(updateHeroSlide({ slideId, slideFormData }));
        } else {
            dispatch(createHeroSlide(slideFormData));
        }
    };

    const handleDelete = (slideId) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            dispatch(deleteHeroSlide(slideId));
        }
    };

    if (status === 'loading') return <Spinner />;

    return (
        <div>
            {isFormOpen && (
                <SlideFormModal
                    slide={editingSlide}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                    mutationStatus={mutationStatus}
                />
            )}
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Hero Carousel</h2>
                <button onClick={() => { setEditingSlide(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    <PlusCircle size={20} /> Add Slide
                </button>
            </div>
            <div className="space-y-4">
                {slides.map(slide => (
                    <div key={slide.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-4">
                            <img src={slide.background_image_url} alt={slide.title} className="w-24 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-text-primary">{slide.title}</p>
                                <p className="text-sm text-text-secondary">{slide.button_link}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {slide.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button onClick={() => { setEditingSlide(slide); setIsFormOpen(true); }} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(slide.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHeroSlides;














// AdminOrderList.jsx





import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../store/ordersSlice';
import Spinner from '../../components/Spinner';

const AdminOrderList = () => {
    const dispatch = useDispatch();
    const { items: orders, status, updateStatus } = useSelector(state => state.orders);

    useEffect(() => {
        // Fetch all orders when the component mounts
        // The API view ensures only staff get all orders
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleStatusChange = (orderId, newStatus) => {
        if (window.confirm(`Are you sure you want to change this order's status to "${newStatus}"?`)) {
            dispatch(updateOrderStatus({ orderId, status: newStatus }));
        }
    };

    const StatusDropdown = ({ order }) => {
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        return (
            <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                disabled={updateStatus === 'loading'}
                className={`p-1.5 border rounded-md text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 border-green-300' : 
                    order.status === 'shipped' ? 'bg-blue-100 border-blue-300' : 
                    order.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                    'bg-yellow-100 border-yellow-300'
                }`}
            >
                {statuses.map(s => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
            </select>
        );
    };

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Orders</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{order.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">${order.total_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                    <StatusDropdown order={order} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrderList;

















// AdminProductForm.jsx




import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    createProduct, 
    updateProduct, 
    fetchProductById, 
    deleteProductImage,
    clearMutationStatus, 
    clearSelectedProduct 
} from '../../store/productsSlice';
import Spinner from '../../components/Spinner';
import { ArrowLeft, Trash2 } from 'lucide-react';

const AdminProductForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEditMode = Boolean(productId);

    const { details: productToEdit, status: productStatus } = useSelector(state => state.products.selectedProduct);
    const { mutationStatus, mutationError } = useSelector(state => state.products);
    const { items: categories } = useSelector(state => state.categories);
    const { colors, sizes } = useSelector(state => state.filters);

    // Form state
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock_quantity: '',
        category_id: '', tag: '', is_available: true, is_featured: false,
        video_url: '', color_ids: [], size_ids: [],
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [galleryImageFiles, setGalleryImageFiles] = useState([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchProductById(productId));
        }
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(clearMutationStatus());
        };
    }, [productId, dispatch, isEditMode]);

    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                description: productToEdit.description || '',
                price: productToEdit.price || '',
                stock_quantity: productToEdit.stock_quantity || '',
                category_id: productToEdit.category?.id || '',
                tag: productToEdit.tag || '',
                is_available: productToEdit.is_available,
                is_featured: productToEdit.is_featured,
                video_url: productToEdit.video_url || '',
                color_ids: productToEdit.colors?.map(c => c.id) || [],
                size_ids: productToEdit.sizes?.map(s => s.id) || [],
            });
            setMainImagePreview(productToEdit.image_url);
        }
    }, [isEditMode, productToEdit]);

    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            navigate('/admin/products');
        }
    }, [mutationStatus, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMultiSelectChange = (e, field) => {
        const { value, checked } = e.target;
        const id = parseInt(value, 10);
        setFormData(prev => {
            const currentIds = prev[field];
            return { ...prev, [field]: checked ? [...currentIds, id] : currentIds.filter(i => i !== id) };
        });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    // UPDATED: This function now appends new files instead of replacing them.
    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryImageFiles(prevFiles => [...prevFiles, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };
    
    // NEW: Function to remove a newly selected gallery image from the preview list.
    const handleRemoveGalleryPreview = (indexToRemove) => {
        setGalleryImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setGalleryImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleDeleteGalleryImage = (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            dispatch(deleteProductImage({ productId, imageId }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(id => productFormData.append(key, id));
            } else {
                productFormData.append(key, value);
            }
        });

        if (mainImageFile) {
            productFormData.append('image', mainImageFile);
        }
        if (galleryImageFiles.length > 0) {
            galleryImageFiles.forEach(file => {
                productFormData.append('uploaded_images', file);
            });
        }

        if (isEditMode) {
            dispatch(updateProduct({ productId, productFormData }));
        } else {
            dispatch(createProduct(productFormData));
        }
    };
    
    if (isEditMode && productStatus === 'loading') return <Spinner />;

    return (
        <div>
            <Link to="/admin/products" className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-orange mb-6">
                <ArrowLeft size={18} /> Back to Product List
            </Link>
            <h2 className="text-2xl font-bold text-text-primary mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Text Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="mt-1 w-full form-input" step="0.01" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Stock Quantity</label>
                        <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="mt-1 w-full form-input" required>
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="mt-1 w-full form-input"></textarea>
                </div>

                {/* Main Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Main Product Image</label>
                    <input type="file" name="image" onChange={handleMainImageChange} className="mt-1 w-full" accept="image/*" />
                    {mainImagePreview && <img src={mainImagePreview} alt="Preview" className="mt-4 h-40 w-auto rounded-lg" />}
                </div>

                {/* Gallery Image Management */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Gallery Images</label>
                    {isEditMode && productToEdit?.images?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-4">
                            {productToEdit.images.map(image => (
                                <div key={image.id} className="relative">
                                    <img src={image.image} alt="Gallery item" className="h-24 w-24 object-cover rounded-lg" />
                                    <button type="button" onClick={() => handleDeleteGalleryImage(image.id)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file" name="gallery_images" onChange={handleGalleryImageChange} className="mt-4 w-full" accept="image/*" multiple />
                    {galleryImagePreviews.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            {galleryImagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt="New gallery preview" className="h-24 w-24 object-cover rounded-lg" />
                                    {/* NEW: Button to remove a newly selected image before upload */}
                                    <button type="button" onClick={() => handleRemoveGalleryPreview(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Multi-Select Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Colors</label>
                        <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {colors.items.map(color => (
                                <label key={color.id} className="flex items-center gap-2">
                                    <input type="checkbox" value={color.id} checked={formData.color_ids.includes(color.id)} onChange={(e) => handleMultiSelectChange(e, 'color_ids')} />
                                    {color.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Sizes</label>
                         <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {sizes.items.map(size => (
                                <label key={size.id} className="flex items-center gap-2">
                                    <input type="checkbox" value={size.id} checked={formData.size_ids.includes(size.id)} onChange={(e) => handleMultiSelectChange(e, 'size_ids')} />
                                    {size.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Tag</label>
                        <select name="tag" value={formData.tag} onChange={handleInputChange} className="mt-1 w-full form-input">
                            <option value="">None</option>
                            <option value="new">New</option>
                            <option value="hot">Hot</option>
                            <option value="special">Special</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Video URL (Optional)</label>
                        <input type="url" name="video_url" value={formData.video_url} onChange={handleInputChange} className="mt-1 w-full form-input" />
                    </div>
                </div>

                {/* Booleans */}
                <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} />
                        Available for sale
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} />
                        Featured product
                    </label>
                </div>

                <div className="pt-4 border-t border-border-light">
                    {mutationStatus === 'failed' && <p className="text-red-500 mb-4">Error: {mutationError}</p>}
                    <button type="submit" disabled={mutationStatus === 'loading'} className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                        {mutationStatus === 'loading' ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;















// AdminProductList.jsx





import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct, updateProduct } from '../../store/productsSlice'; // Import updateProduct
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminProductList = () => {
    const dispatch = useDispatch();
    const { items: products, listStatus, mutationStatus } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchAdminProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
            dispatch(deleteProduct(productId));
        }
    };

    // NEW: Handler for the featured toggle switch
    const handleFeatureToggle = (product) => {
        const data = {
            is_featured: !product.is_featured
        };
        dispatch(updateProduct({ productId: product.id, data }));
    };

    if (listStatus === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Products</h2>
                <Link
                    to="/admin/products/new"
                    className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusCircle size={20} />
                    Add Product
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image_url} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{product.name}</div>
                                            <div className="text-sm text-text-secondary">{product.category_name}</div>
                                        </div>
                                    </div>
                                </td>
                                {/* NEW: Featured Toggle Switch */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label htmlFor={`featured-${product.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id={`featured-${product.id}`} 
                                                className="sr-only" 
                                                checked={product.is_featured}
                                                onChange={() => handleFeatureToggle(product)}
                                            />
                                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${product.is_featured ? 'translate-x-4 !bg-brand-orange' : ''}`}></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {product.is_available ? 'Available' : 'Unavailable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                                        <Edit size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)} 
                                        className="text-red-600 hover:text-red-900 inline-block"
                                        disabled={mutationStatus === 'loading'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;


















// AdminSiteConfigPage.jsx






import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSiteConfig, clearUpdateStatus } from '../../store/siteSlice';
import Spinner from '../../components/Spinner';

const AdminSiteConfigPage = () => {
    const dispatch = useDispatch();
    const { config, status, updateStatus, updateError } = useSelector(state => state.site);

    const [formData, setFormData] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [aboutImagePreview, setAboutImagePreview] = useState('');

    useEffect(() => {
        if (config) {
            setFormData({
                site_name: config.site_name || '',
                about_title: config.about_title || '',
                about_story: config.about_story || '',
                about_mission: config.about_mission || '',
                contact_email: config.contact_email || '',
                contact_phone: config.contact_phone || '',
                contact_address: config.contact_address || '',
                brand_video_url: config.brand_video_url || '', // Add new field to state
            });
            setLogoPreview(config.logo_url || '');
            setAboutImagePreview(config.about_image_url || '');
        }
    }, [config]);

    useEffect(() => {
        return () => {
            dispatch(clearUpdateStatus());
        };
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleAboutImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAboutImageFile(file);
            setAboutImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const configFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            configFormData.append(key, value);
        });
        if (logoFile) {
            configFormData.append('logo', logoFile);
        }
        if (aboutImageFile) {
            configFormData.append('about_image', aboutImageFile);
        }
        dispatch(updateSiteConfig(configFormData));
    };

    if (status === 'loading') {
        return <Spinner />;
    }

    return (
        <div>
            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Site Configuration</h2>
                <p className="text-sm text-text-secondary mt-1">Update general site settings, branding, and content.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Site Name</label>
                            <input type="text" name="site_name" value={formData.site_name} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Logo</label>
                            <input type="file" name="logo" onChange={handleLogoChange} className="mt-1 w-full" accept="image/*" />
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-4 h-16 w-auto bg-gray-100 p-2 rounded-lg" />}
                        </div>
                        {/* NEW: Input for Brand Video URL */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Brand Video URL</label>
                            <input type="url" name="brand_video_url" value={formData.brand_video_url} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full form-input" />
                        </div>
                    </div>
                </div>

                {/* About Page Content */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">About Page Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Title</label>
                            <input type="text" name="about_title" value={formData.about_title} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Story</label>
                            <textarea name="about_story" value={formData.about_story} onChange={handleInputChange} rows="5" className="mt-1 w-full form-input"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Mission</label>
                            <textarea name="about_mission" value={formData.about_mission} onChange={handleInputChange} rows="3" className="mt-1 w-full form-input"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Page Image</label>
                            <input type="file" name="about_image" onChange={handleAboutImageChange} className="mt-1 w-full" accept="image/*" />
                            {aboutImagePreview && <img src={aboutImagePreview} alt="About Preview" className="mt-4 h-32 w-auto rounded-lg" />}
                        </div>
                    </div>
                </div>
                
                {/* Contact Info */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Contact Email</label>
                            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Contact Phone</label>
                            <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-text-secondary">Contact Address</label>
                        <input type="text" name="contact_address" value={formData.contact_address} onChange={handleInputChange} className="mt-1 w-full form-input" />
                    </div>
                </div>

                {/* Submission */}
                <div className="pt-4">
                    {updateStatus === 'succeeded' && <p className="text-green-600 mb-4">Configuration saved successfully!</p>}
                    {updateStatus === 'failed' && <p className="text-red-500 mb-4">Error: {updateError}</p>}
                    <button type="submit" disabled={updateStatus === 'loading'} className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                        {updateStatus === 'loading' ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSiteConfigPage;









// AdminUserList.jsx







import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers, updateUserAdmin, deleteUser, clearUpdateStatus } from '../../store/usersSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2 } from 'lucide-react';

// --- Edit User Modal Component ---
const EditUserModal = ({ user, roles, onClose, onSave, updateStatus }) => {
    const [isActive, setIsActive] = useState(user.is_active);
    const [isStaff, setIsStaff] = useState(user.is_staff);
    const [selectedRoleIds, setSelectedRoleIds] = useState(user.groups.map(g => g.id));

    const handleRoleChange = (roleId) => {
        setSelectedRoleIds(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    const handleSave = () => {
        const userData = {
            is_active: isActive,
            is_staff: isStaff,
            group_ids: selectedRoleIds,
            name: user.name,
        };
        onSave(user.id, userData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-6">Edit User: {user.name}</h3>
                <div className="space-y-6">
                    {/* Status Toggles */}
                    <div className="flex items-center gap-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                            User is Active
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isStaff} onChange={(e) => setIsStaff(e.target.checked)} />
                            User is Staff
                        </label>
                    </div>

                    {/* Role Management */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Roles</label>
                        <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {roles.map(role => (
                                <label key={role.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={role.id}
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => handleRoleChange(role.id)}
                                    />
                                    {role.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-border-light">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={updateStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                        {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main User List Component ---
const AdminUserList = () => {
    const dispatch = useDispatch();
    const { users, roles, status, updateStatus } = useSelector(state => state.users);
    const { user: currentUser } = useSelector(state => state.auth); // Get the currently logged-in user
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        if (updateStatus === 'succeeded') {
            setEditingUser(null);
            dispatch(clearUpdateStatus());
        }
    }, [updateStatus, dispatch]);

    const handleSaveUser = (userId, userData) => {
        dispatch(updateUserAdmin({ userId, userData }));
    };

    // NEW: Handler for deleting a user
    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            dispatch(deleteUser(userId));
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    roles={roles}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                    updateStatus={updateStatus}
                />
            )}

            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Users</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Roles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                    {user.groups.map(g => g.name).join(', ') || 'User'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setEditingUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    {/* Prevent admin from deleting themselves */}
                                    {currentUser?.id !== user.id && (
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserList;













// OrderHistory.jsx




import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const OrderHistory = () => {
    const { items: orders, status, error } = useSelector((state) => state.orders);

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    if (status === 'failed') {
        return <p className="text-center text-red-500">Error fetching orders: {error}</p>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold text-text-primary">No Orders Found</h2>
                <p className="mt-2 text-text-secondary">You haven't placed any orders with us yet.</p>
                <Link to="/shop" className="mt-6 inline-block bg-brand-orange text-white font-bold py-2 px-6 rounded-lg text-base hover:bg-opacity-90 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6 border-b border-border-light pb-4">Order History</h2>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="border border-border-light rounded-lg p-4 md:p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4 pb-4 border-b border-border-light gap-4">
                            <div>
                                <h3 className="font-semibold text-lg text-text-primary">Order #{order.id}</h3>
                                <p className="text-sm text-text-secondary">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-sm text-text-secondary">Ship to: {order.shipping_address}</p>
                            </div>
                            <div className="text-left md:text-right flex-shrink-0">
                                <p className="font-semibold text-text-primary">Total: ${order.total_price}</p>
                                <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.product.image_url} alt={item.product.name} className="w-16 h-20 object-cover rounded-md bg-gray-100" />
                                    <div>
                                        <p className="font-semibold text-text-primary">{item.product.name}</p>
                                        <p className="text-sm text-text-secondary">Qty: {item.quantity} &times; ${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;









// AboutPage.jsx





import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

// FIXED: Fully defined the TeamMemberCard component
const TeamMemberCard = ({ name, role, imageUrl, socialLinks }) => (
    <div className="text-center">
        <img 
            src={imageUrl} 
            alt={`Portrait of ${name}`}
            className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg mb-4"
        />
        <h4 className="text-xl font-semibold text-text-primary">{name}</h4>
        <p className="text-brand-orange">{role}</p>
        <div className="flex justify-center space-x-4 mt-3">
            <a href={socialLinks.twitter} className="text-text-secondary hover:text-brand-orange"><Twitter /></a>
            <a href={socialLinks.linkedin} className="text-text-secondary hover:text-brand-orange"><Linkedin /></a>
        </div>
    </div>
);

// Helper to get YouTube embed URL (can be moved to a utils file)
const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (error) {
        return null;
    }
};

// --- Main AboutPage Component ---

const AboutPage = () => {
    const { config, status } = useSelector((state) => state.site);
    const embedUrl = getYouTubeEmbedUrl(config.brand_video_url);

    const team = [
        { name: 'John Doe', role: 'Founder & CEO', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=JD', socialLinks: { twitter: '#', linkedin: '#' } },
        { name: 'Jane Smith', role: 'Lead Designer', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=JS', socialLinks: { twitter: '#', linkedin: '#' } },
        { name: 'Sam Wilson', role: 'Head of Marketing', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=SW', socialLinks: { twitter: '#', linkedin: '#' } },
    ];

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-background-light">
            {/* --- Hero Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h1 className="text-4xl md:text-5xl font-anton uppercase text-text-primary mb-6">
                            {config.about_title || "Who is The প্রফেসর?"}
                        </h1>
                        <div className="prose max-w-none text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
                            <p>{config.about_story || "Our story..."}</p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <img 
                            src={config.about_image_url || "https://placehold.co/600x600/F36523/1a1a1a?text=The+Brand+Story"} 
                            alt="The প্রফেসর Brand Aesthetic" 
                            className="rounded-lg shadow-2xl w-full h-auto object-cover" 
                        />
                    </div>
                </div>
            </div>

            {/* --- Mission Statement Section --- */}
            <div className="bg-white py-20">
                <div className="text-center max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-anton text-brand-orange mb-4">Our Mission</h2>
                    <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
                        {config.about_mission || "Our mission..."}
                    </p>
                </div>
            </div>

            {/* --- Team Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-anton text-center text-text-primary mb-12">Meet Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {team.map(member => <TeamMemberCard key={member.name} {...member} />)}
                </div>
            </div>

            {/* --- Video Section --- */}
            <div className="bg-gray-800 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl font-anton">A GLIMPSE BEHIND THE SEAMS</h2>
                    <p className="mt-4 max-w-2xl mx-auto">Discover the process and dedication that define our brand.</p>
                    <div className="mt-8">
                        <div className="aspect-video max-w-3xl mx-auto bg-black rounded-lg shadow-lg">
                            {embedUrl ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={embedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-400">Video not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Physical Store Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-anton text-center text-text-primary mb-12">Visit Our Flagship Store</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="aspect-video bg-gray-300 rounded-lg shadow-md">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086438997744!2d144.9537353153167!3d-37.81720997975189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627000000000!5m2!1sen!2sus"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }}
                                allowFullScreen="" 
                                loading="lazy"
                                title="Store Location"
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Address</h4>
                                <p>{config.contact_address || "123 Style Avenue, Fashion City, 54321"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Phone</h4>
                                <p>{config.contact_phone || "+1 (234) 567-890"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Email</h4>
                                <a href={`mailto:${config.contact_email}`} className="hover:text-brand-orange">{config.contact_email || "contact@theprofesor.com"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TeamMemberCard.defaultProps = { socialLinks: {} };
export default AboutPage;














// AdminDashboardPage.jsx





import React, { useMemo } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Package, Tag, ShoppingBag, Palette, Settings, Users, Image as ImageIcon } from 'lucide-react';

const AdminDashboardPage = () => {
    const location = useLocation();
    
    // Get the list of all orders from the Redux store
    const { items: orders } = useSelector(state => state.orders);

    // Calculate the number of pending orders. useMemo ensures this only recalculates when orders change.
    const pendingOrdersCount = useMemo(() => {
        return orders.filter(order => order.status === 'pending').length;
    }, [orders]);

    const navLinks = [
        { name: 'Manage Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Manage Categories', path: '/admin/categories', icon: <Tag size={20} /> },
        { name: 'Manage Attributes', path: '/admin/attributes', icon: <Palette size={20} /> },
        { 
            name: 'Manage Orders', 
            path: '/admin/orders', 
            icon: <ShoppingBag size={20} />,
            // Add the count to the link object if it's greater than zero
            badge: pendingOrdersCount > 0 ? pendingOrdersCount : null 
        },
        { name: 'Manage Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Hero Section', path: '/admin/hero', icon: <ImageIcon size={20} /> },
        { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];
    
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
        return <Navigate to="/admin/products" replace />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">Admin Dashboard</h1>
                <p className="mt-4 text-lg text-text-secondary">Manage your e-commerce store.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <aside className="md:w-64 flex-shrink-0 w-full">
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-border-light sticky top-24">
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        // Added justify-between to push badge to the right
                                        `flex items-center justify-between gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-brand-orange text-white'
                                                : 'text-text-primary hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        {link.icon}
                                        <span>{link.name}</span>
                                    </div>
                                    {/* Render the badge if the count exists */}
                                    {link.badge && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {link.badge}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="flex-grow bg-white p-6 md:p-8 rounded-lg shadow-sm border border-border-light w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboardPage;








// CartPage.jsx




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, clearCart } from '../store/cartSlice';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const CartItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 border-b border-border-light">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
        <div>
          <Link to={`/products/${item.id}`} className="font-semibold text-text-primary hover:text-brand-orange transition-colors">{item.name}</Link>
          <p className="text-text-secondary text-sm">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border-light rounded-md">
          <button 
            onClick={() => dispatch(removeItemFromCart(item.id))}
            className="p-2 text-text-secondary hover:text-brand-orange"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 text-text-primary font-semibold">{item.quantity}</span>
          <button 
            onClick={() => dispatch(addItemToCart(item))}
            className="p-2 text-text-secondary hover:text-brand-orange"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="font-bold text-text-primary w-24 text-right">${item.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-text-secondary" />
        <h1 className="mt-8 text-4xl font-anton text-text-primary">Your Cart is Empty</h1>
        <p className="mt-4 text-text-secondary">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="mt-8 inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-anton text-center text-text-primary mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-border-light">
          {cartItems.map(item => <CartItem key={item.id} item={item} />)}
          <div className="p-4 flex justify-end">
            <button 
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-28 shadow-md border border-border-light">
            <h2 className="text-2xl font-semibold text-text-primary border-b border-border-light pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between text-text-secondary mb-2">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-secondary mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-text-primary font-bold text-xl border-t border-border-light pt-4 mt-4">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            {/* UPDATED: Changed to a Link that navigates to the new checkout page */}
            <Link 
              to={isAuthenticated ? "/checkout" : "/login"}
              className="w-full text-center block mt-6 bg-brand-orange text-white font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;









// CheckoutPage.jsx









import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, resetCreateStatus } from '../store/ordersSlice';
import { clearCart } from '../store/cartSlice';
import Spinner from '../components/Spinner';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: cartItems, totalAmount } = useSelector(state => state.cart);
    const { createStatus, createError } = useSelector(state => state.orders);
    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        shipping_address: '',
        city: '',
        postal_code: '',
        card_number: '',
        expiry_date: '',
        cvc: '',
    });

    useEffect(() => {
        // If the order is created successfully, clear the cart and redirect
        if (createStatus === 'succeeded') {
            dispatch(clearCart());
            dispatch(resetCreateStatus());
            navigate('/dashboard/orders');
        }
        // Cleanup on unmount
        return () => dispatch(resetCreateStatus());
    }, [createStatus, dispatch, navigate]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && createStatus !== 'loading') {
            navigate('/cart');
        }
    }, [cartItems, navigate, createStatus]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderData = {
            shipping_address: formData.shipping_address,
            city: formData.city,
            postal_code: formData.postal_code,
            cart: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };
        dispatch(createOrder(orderData));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-anton text-center text-text-primary mb-12">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Shipping & Payment Details */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-border-light space-y-8">
                    {/* Shipping Address */}
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" defaultValue={user?.name} className="mt-1 w-full form-input bg-gray-100" readOnly />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary">Street Address</label>
                                <input type="text" name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Postal Code</label>
                                <input type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                        </div>
                    </section>

                    {/* Mock Payment Details */}
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">Payment Details</h2>
                        <p className="text-sm text-text-secondary mb-4">This is a mock payment form. Do not enter real credit card details.</p>
                        <div className="space-y-6">
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Card Number</label>
                                <input type="text" name="card_number" value={formData.card_number} onChange={handleInputChange} placeholder="4242 4242 4242 4242" className="mt-1 w-full form-input" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Expiry Date</label>
                                    <input type="text" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} placeholder="MM/YY" className="mt-1 w-full form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">CVC</label>
                                    <input type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="123" className="mt-1 w-full form-input" required />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-6 sticky top-28 shadow-md border border-border-light">
                        <h2 className="text-2xl font-semibold text-text-primary border-b border-border-light pb-4 mb-4">Your Order</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-text-primary">{item.name} &times; {item.quantity}</span>
                                    <span className="font-medium text-text-secondary">${item.totalPrice.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-text-primary font-bold text-xl border-t border-border-light pt-4 mt-4">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        {createError && <p className="text-red-500 text-sm mt-4">Error: {createError}</p>}
                        <button 
                            type="submit"
                            disabled={createStatus === 'loading'}
                            className="w-full text-center block mt-6 bg-brand-orange text-white font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                        >
                            {createStatus === 'loading' ? <Spinner /> : `Place Order ($${totalAmount.toFixed(2)})`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;











// ContactPage.jsx




import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

// --- Sub-components for ContactPage ---

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-light py-4">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-text-primary">{question}</h4>
                <ChevronDown size={20} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 text-text-secondary">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

// --- Main ContactPage Component ---

const ContactPage = () => {
    const { config, status } = useSelector((state) => state.site);

    const faqs = [
        { q: 'What are your shipping options?', a: 'We offer standard and express shipping. Standard shipping takes 5-7 business days, while express takes 2-3 business days. All orders over $50 qualify for free standard shipping.' },
        { q: 'How can I track my order?', a: 'Once your order has shipped, you will receive an email with a tracking number and a link to the carrier\'s website.' },
        { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase for a full refund or exchange. Items must be in their original condition with tags attached. Please visit our returns portal to initiate a return.' },
        { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International shipping rates and times vary by destination.' },
    ];

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-background-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">Contact Us</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                        We're here to help. Reach out to us with any questions or feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* --- Contact Form --- */}
                    <div className="bg-white p-8 rounded-lg shadow-md border border-border-light">
                        <h2 className="text-2xl font-bold mb-6 text-text-primary">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Message</label>
                                <textarea id="message" name="message" rows="5" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- Contact Info --- */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-md border border-border-light space-y-6">
                            <h3 className="text-xl font-semibold text-text-primary">Contact Information</h3>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Address</h4>
                                    <p className="text-text-secondary">{config.contact_address || "123 Style Avenue, Fashion City, 54321"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Phone</h4>
                                    <p className="text-text-secondary">{config.contact_phone || "+1 (234) 567-890"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Email</h4>
                                    <a href={`mailto:${config.contact_email}`} className="text-text-secondary hover:text-brand-orange">{config.contact_email || "contact@theprofesor.com"}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Working Hours</h4>
                                    <p className="text-text-secondary">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p className="text-text-secondary">Saturday: 10:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border border-border-light">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Frequently Asked Questions</h3>
                            <div>
                                {faqs.map(faq => <FaqItem key={faq.q} question={faq.q} answer={faq.a} />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Map Section --- */}
                <div className="mt-16">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-300 rounded-lg shadow-md overflow-hidden">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086438997744!2d144.9537353153167!3d-37.81720997975189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627000000000!5m2!1sen!2sus"
                            width="100%" 
                            height="450" 
                            style={{ border: 0 }}
                            allowFullScreen="" 
                            loading="lazy"
                            title="Store Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
















// DashboardPage.jsx











import React from 'react';
import { NavLink, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, Heart, LogOut } from 'lucide-react';
import { logout } from '../store/authSlice';

const DashboardPage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const navLinks = [
        { name: 'Order History', path: '/dashboard/orders', icon: <ShoppingBag size={20} /> },
        // { name: 'Profile Settings', path: '/dashboard/profile', icon: <User size={20} /> },
    ];
    
    // If the user lands on the base /dashboard URL, redirect them to the first section.
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
        return <Navigate to="/dashboard/orders" replace />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">My Account</h1>
                <p className="mt-4 text-lg text-text-secondary">Welcome back, {user?.name}!</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 flex-shrink-0 w-full">
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-border-light sticky top-24">
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-brand-orange text-white'
                                                : 'text-text-primary hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </NavLink>
                            ))}
                             <NavLink
                                to="/wishlist"
                                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-text-primary hover:bg-gray-100 transition-colors"
                            >
                                <Heart size={20} />
                                <span>Wishlist</span>
                            </NavLink>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-text-primary hover:bg-gray-100 transition-colors text-left w-full"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-grow bg-white p-6 md:p-8 rounded-lg shadow-sm border border-border-light w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;










// HomePage.jsx








import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Sub-components for the HomePage ---

const HeroCarousel = ({ slides }) => (
  <section className="w-full h-[70vh] md:h-[90vh] bg-gray-200">
    {/* Custom styles for the Swiper navigation and pagination to match the theme */}
    <style>{`
      .hero-carousel .swiper-button-next,
      .hero-carousel .swiper-button-prev {
        color: #F36523; /* brand-orange */
        background-color: rgba(255, 255, 255, 0.6);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .hero-carousel .swiper-button-next:hover,
      .hero-carousel .swiper-button-prev:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
      .hero-carousel .swiper-button-next::after,
      .hero-carousel .swiper-button-prev::after {
        font-size: 24px;
        font-weight: bold;
      }
      .hero-carousel .swiper-pagination-bullet {
        background-color: rgba(255, 255, 255, 0.7);
        width: 10px;
        height: 10px;
        opacity: 1;
        transition: background-color 0.3s ease;
      }
      .hero-carousel .swiper-pagination-bullet-active {
        background-color: #F36523; /* brand-orange */
      }
    `}</style>
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={slides.length > 1}
      className="h-full hero-carousel" // Added class for scoping styles
    >
      {slides.map((slide) => (
        <SwiperSlide 
          key={slide.id} 
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.background_image_url})` }}
        >
          {/* <img src={slide.background_image_url} alt="" /> */}
          <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white p-4 max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-anton uppercase tracking-wider">{slide.title}</h1>
              <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg">{slide.subtitle}</p>
              <Link to={slide.button_link} className="mt-8 bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 inline-block">
                {slide.button_text}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const FeaturedCategories = ({ categories }) => (
  <section className="py-12 md:py-16 bg-background-light">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Featured Categories</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/shop?category=${category.slug}`} 
            className="group relative block overflow-hidden rounded-lg aspect-[4/5] bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image_url || 'https://placehold.co/400x500/cccccc/334155?text=Category'})` }}
          >
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-20">
              <h3 className="text-xl md:text-2xl text-white font-anton uppercase tracking-widest text-center px-2">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = ({ products }) => (
  <section className="py-12 md:py-16 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  </section>
);


const LatestProducts = ({ products }) => (
    <section className="py-12 md:py-16 bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Latest Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    </section>
);

const Newsletter = () => (
  <section className="py-16 md:py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 className="text-3xl md:text-4xl font-anton text-white">JOIN THE INNER CIRCLE</h2>
      <p className="text-white mt-2 mb-6 max-w-lg mx-auto">Get exclusive access to new drops, special offers, and style inspiration.</p>
      <form className="max-w-md mx-auto flex">
        <input type="email" placeholder="Enter your email address" className="w-full px-4 py-3 rounded-l-lg border-none text-text-primary focus:ring-2 focus:ring-brand-orange" required />
        <button type="submit" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-r-lg hover:bg-opacity-90 transition-colors">Subscribe</button>
      </form>
    </div>
  </section>
);

const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const VideoCtaSection = ({ videoUrl }) => {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    return (
        <section className="py-16 md:py-20 bg-gray-800 text-white" style={{backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.8)), url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-anton">WATCH OUR BRAND STORY</h2>
                <p className="mt-4 max-w-2xl mx-auto">See the passion and craftsmanship that goes into every piece we create.</p>
                <div className="mt-8">
                    <div className="aspect-video max-w-3xl mx-auto bg-black rounded-lg shadow-lg">
                        {embedUrl ? ( <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg"></iframe> ) : ( <div className="flex items-center justify-center h-full"><p className="text-gray-400">Video not available.</p></div> )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main HomePage Component ---

const HomePage = () => {
  const { items: allProducts, listStatus } = useSelector((state) => state.products);
  const { items: allCategories } = useSelector((state) => state.categories);
  const { config: siteConfig } = useSelector((state) => state.site);
  const { slides: heroSlides, status: heroStatus } = useSelector((state) => state.hero);

  const {featured: featuredProducts } = useSelector((state) => state.products); // Get featuredProducts from the new state
  const featuredCategories = useMemo(() => allCategories.filter(c => c.is_featured).slice(0, 4), [allCategories]);
  const latestProducts = useMemo(() => [...allProducts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8), [allProducts]);
  
  if (listStatus === 'loading' || heroStatus === 'loading') {
    return <Spinner />;
  }

  console.log(featuredProducts)

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <FeaturedCategories categories={featuredCategories} />
      <FeaturedProducts products={featuredProducts} />
      <VideoCtaSection videoUrl={siteConfig.brand_video_url} />
      <LatestProducts products={latestProducts} />
      <Newsletter />
    </>
  );
};

HeroCarousel.defaultProps = { slides: [] };
FeaturedCategories.defaultProps = { categories: [] };
FeaturedProducts.defaultProps = { products: [] };
LatestProducts.defaultProps = { products: [] };

export default HomePage;













// LoginPage.jsx









// pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const { logo_url } = useSelector((state) => state.site.config);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Attempting login with:", { email, password }); // Keep for debugging if needed
    dispatch(loginUser({ email, password }));
  };
  
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.detail) return error.detail;
    if (typeof error === 'object') {
        return JSON.stringify(error, null, 2); 
    }
    return 'An unknown error occurred.';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light px-4">
      {/* Changed bg-neutral-900 to bg-white, added shadow and border */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-border-light">
        <div className="text-center">
            <Link to="/">
                <img 
                  src={logo_url || "https://i.imgur.com/K9b2uFj.png"} 
                  alt="The প্রফেসর Logo" 
                  className="h-20 w-auto mx-auto mb-4" 
                />
            </Link>
          {/* Changed text-white to text-text-primary */}
          <h2 className="text-3xl font-anton text-text-primary">Welcome Back</h2>
          <p className="mt-2 text-text-secondary">Sign in to continue to your account.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            {/* Changed text-gray-500 to text-text-secondary */}
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
              placeholder="Email address"
              required
            />
          </div>
          {/* Password Input */}
          <div className="relative">
            {/* Changed text-gray-500 to text-text-secondary */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
              placeholder="Password"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* Error Message */}
          {status === 'failed' && error && (
            <div className="text-center text-red-700 text-sm p-2 bg-red-100 rounded-md">
                {getErrorMessage()}
            </div>
          )}
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        {/* Changed text-gray-400 to text-text-secondary */}
        <p className="text-sm text-center text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-orange hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;













// ProductDetailPage.jsx





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














// RegisterPage.jsx





import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const { logo_url } = useSelector((state) => state.site.config);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const getErrorMessages = () => {
    if (!error) return null;
    if (typeof error === 'string') return <li>{error}</li>;
    if (typeof error === 'object') {
      return Object.entries(error).map(([field, messages]) => {
        const messageText = Array.isArray(messages) ? messages.join(', ') : messages;
        return <li key={field}>{`${field.replace(/_/g, ' ')}: ${messageText}`}</li>;
      });
    }
    return <li>An unexpected error occurred.</li>;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light px-4 py-12">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-border-light">
        <div className="text-center">
          <Link to="/">
            <img
              src={logo_url || "https://i.imgur.com/K9b2uFj.png"}
              alt="The প্রফেসর Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
          </Link>
          <h2 className="text-3xl font-anton text-text-primary">Create an Account</h2>
          <p className="mt-2 text-text-secondary">Join the inner circle and define your style.</p>
        </div>

        {status === 'succeeded' ? (
          <div className="text-center p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="font-bold text-green-800">Registration Successful!</h3>
            <p className="text-green-700 mt-2">Please check your email to activate your account.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              icon={<User />}
              required
            />
            <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} icon={<Mail />} required />
            <InputField name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={handleChange} icon={<Lock />} required>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>
            <InputField name="re_password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.re_password} onChange={handleChange} icon={<Lock />} required>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>

            {status === 'failed' && error && (
              <ul className="text-left text-red-700 text-sm list-disc list-inside p-2 bg-red-100 rounded-md">
                {getErrorMessages()}
              </ul>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-center text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-orange hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ name, type, placeholder, value, onChange, icon, required = false, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary">{icon}</span>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
      placeholder={placeholder}
      required={required}
    />
    {children}
  </div>
);

export default RegisterPage;
















// ShopPage.jsx


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';
import { Search, ChevronDown, Filter } from 'lucide-react';

// Debounce hook to delay function execution
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const FilterSection = ({ title, items, selectedItems, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="py-4 border-b border-border-light">
            <button 
                className="w-full flex justify-between items-center font-semibold text-text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-4 space-y-2">
                    {items.map(item => (
                        <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
                                checked={selectedItems.includes(item.name)}
                                onChange={() => onSelectionChange(item.name)}
                            />
                            <span className="text-sm">{item.name}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <nav className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-border-light rounded-md disabled:opacity-50"
            >
                Previous
            </button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-border-light rounded-md disabled:opacity-50"
            >
                Next
            </button>
        </nav>
    );
};


const ShopPage = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { items: products, pagination, listStatus } = useSelector((state) => state.products);
    const { items: categories } = useSelector((state) => state.categories);
    const { colors, sizes } = useSelector((state) => state.filters);

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isFilterSidebarOpen, setFilterSidebarOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

    const activeFilters = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        category: searchParams.get('category') || '',
        colors: searchParams.getAll('colors') || [],
        sizes: searchParams.getAll('sizes') || [],
        search: searchParams.get('search') || '',
    }), [searchParams]);

    const updateFilters = useCallback((newFilters) => {
        const currentParams = new URLSearchParams(searchParams);
        
        Object.entries(newFilters).forEach(([key, value]) => {
            currentParams.delete(key);
            if (Array.isArray(value)) {
                value.forEach(v => currentParams.append(key, v));
            } else if (value) {
                currentParams.set(key, value);
            }
        });
        
        if (!('page' in newFilters)) {
            currentParams.set('page', '1');
        }

        setSearchParams(currentParams);
    }, [searchParams, setSearchParams]);
    
    // EFFECT: Re-fetch products when active filters (derived from URL) change
    useEffect(() => {
        dispatch(fetchProducts(activeFilters));
    }, [dispatch, activeFilters]);

    // EFFECT: Update URL when debounced search term changes
    useEffect(() => {
        updateFilters({ search: debouncedSearchTerm });
    }, [debouncedSearchTerm, updateFilters]);
    
    const handleCategoryChange = (e) => {
        updateFilters({ category: e.target.value });
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(pagination.count / 12)) {
            updateFilters({ page: newPage });
        }
    };
    
    const handleMultiSelectChange = (key, value) => {
        const currentValues = activeFilters[key];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        updateFilters({ [key]: newValues });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">Our Collection</h1>
                <p className="mt-4 max-w-xl mx-auto text-lg text-text-secondary">
                    Browse through our curated selection of premium menswear.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={`lg:w-64 lg:flex-shrink-0 ${isFilterSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-border-light sticky top-24">
                        <h3 className="text-xl font-semibold mb-4">Filters</h3>
                        <div className="py-4 border-b border-border-light">
                            <label htmlFor="category-select" className="font-semibold text-text-primary">Category</label>
                            <select 
                                id="category-select"
                                value={activeFilters.category}
                                onChange={handleCategoryChange}
                                className="mt-2 w-full bg-gray-200 text-text-primary rounded-md py-2 px-3 appearance-none focus:ring-2 focus:ring-brand-orange focus:outline-none"
                            >
                                <option value="">All</option>
                                {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                            </select>
                        </div>
                        <FilterSection 
                            title="Color"
                            items={colors.items}
                            selectedItems={activeFilters.colors}
                            onSelectionChange={(colorName) => handleMultiSelectChange('colors', colorName)}
                        />
                        <FilterSection 
                            title="Size"
                            items={sizes.items}
                            selectedItems={activeFilters.sizes}
                            onSelectionChange={(sizeName) => handleMultiSelectChange('sizes', sizeName)}
                        />
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="flex-grow">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex-grow max-w-lg flex items-center">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white text-text-primary rounded-l-md py-2 px-4 w-full border border-border-light focus:ring-2 focus:ring-brand-orange focus:outline-none" 
                            />
                            <button className="bg-brand-orange p-2.5 rounded-r-md">
                                <Search size={20} className="text-white"/>
                            </button>
                        </div>
                        <button 
                            className="lg:hidden p-2 bg-white border border-border-light rounded-md ml-4"
                            onClick={() => setFilterSidebarOpen(!isFilterSidebarOpen)}
                        >
                            <Filter size={20} />
                        </button>
                    </div>
                    
                    {listStatus === 'loading' && <Spinner />}
                    {listStatus === 'failed' && <p className="text-center text-red-500">Could not load products.</p>}
                    {listStatus === 'succeeded' && (
                        products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <Pagination 
                                    currentPage={activeFilters.page}
                                    totalPages={Math.ceil(pagination.count / 12)}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <h3 className="text-2xl font-semibold text-text-primary">No Products Found</h3>
                                <p className="text-text-secondary mt-2">Try adjusting your search or filter criteria.</p>
                            </div>
                        )
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopPage;












// WishlistPage.jsx





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















// usersSlice.jsx




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

// --- ASYNC THUNKS ---

// UPDATED: Uses the correct '/api/manage/' prefix
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/users/');
      if (!response.ok) throw new Error('Failed to fetch users.');
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const fetchRoles = createAsyncThunk(
  'users/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/roles/');
      if (!response.ok) throw new Error('Failed to fetch roles.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const updateUserAdmin = createAsyncThunk(
  'users/updateUserAdmin',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/users/${userId}/`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the correct '/api/manage/' prefix
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/users/${userId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE DEFINITION (no changes needed here) ---
const initialState = {
  users: [],
  roles: [],
  status: 'idle',
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users cases
      .addCase(fetchAllUsers.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.status = 'succeeded'; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Fetch roles cases
      .addCase(fetchRoles.fulfilled, (state, action) => { state.roles = action.payload; })
      
      // Update user cases
      .addCase(updateUserAdmin.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserAdmin.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { clearUpdateStatus } = usersSlice.actions;
export default usersSlice.reducer;















// uiSlice.jsx







import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeMenu(state) {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleMenu, closeMenu } = uiSlice.actions;
export default uiSlice.reducer;















// store.jsx




import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './uiSlice.jsx';
import productsSlice from './productsSlice.jsx';
import cartSlice from './cartSlice.jsx';
import authSlice from './authSlice.jsx';
import siteSlice from './siteSlice.jsx';
import filtersSlice from './filtersSlice.jsx';
import categoriesSlice from './categoriesSlice.jsx';
import ordersSlice from './ordersSlice.jsx';
import usersSlice from './usersSlice.jsx';
import heroSlice from './heroSlice.jsx'; // Import the new hero slice

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    products: productsSlice,
    cart: cartSlice,
    auth: authSlice,
    site: siteSlice,
    filters: filtersSlice,
    categories: categoriesSlice,
    orders: ordersSlice,
    users: usersSlice,
    hero: heroSlice, // Add the new slice to the reducer
  },
});













// siteSlice.jsx








import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- ASYNC THUNKS ---

// Public endpoint, no changes needed
export const fetchSiteConfig = createAsyncThunk(
  'site/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/site-config/`);
      if (!response.ok) {
        throw new Error('Failed to fetch site configuration.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const updateSiteConfig = createAsyncThunk(
  'site/updateConfig',
  async (configFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/site-config/', {
        method: 'PUT',
        body: configFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---

const initialState = {
  config: {
    site_name: 'The প্রফেসর',
    logo_url: null,
    about_title: '',
    about_image_url: null,
    about_story: '',
    about_mission: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    brand_video_url: '',
  },
  status: 'idle',
  error: null,
  updateStatus: 'idle',
  updateError: null,
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    clearUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchSiteConfig.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.config = action.payload;
      })
      .addCase(fetchSiteConfig.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Update cases
      .addCase(updateSiteConfig.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateSiteConfig.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.config = action.payload;
      })
      .addCase(updateSiteConfig.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { clearUpdateStatus } = siteSlice.actions;
export default siteSlice.reducer;










// productsSlice.jsx












import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- ASYNC THUNKS ---

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category__slug', filters.category);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.colors && filters.colors.length > 0) {
        params.append('colors__name__in', filters.colors.join(','));
      }
      if (filters.sizes && filters.sizes.length > 0) {
        params.append('sizes__name__in', filters.sizes.join(','));
      }
      
      const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW: Dedicated thunk to fetch only featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/?is_featured=true`);
      if (!response.ok) throw new Error('Failed to fetch featured products.');
      const data = await response.json();
      return data.results || []; // Return the results array
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      
      const response = await api(`/api/manage/products/?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch admin products.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/`);
      if (!response.ok) throw new Error('Failed to fetch product details.');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/manage/products/', {
        method: 'POST',
        body: productFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;
      const response = await api(`/api/manage/products/${productId}/`, {
        method: 'PATCH',
        body: isFormData ? data : JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(responseData));
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/products/${productId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  'products/deleteProductImage',
  async ({ productId, imageId }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/manage/products/${productId}/images/${imageId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return { imageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProductReview = createAsyncThunk(
  'products/addProductReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const payload = { ...reviewData, product: productId };
      const response = await api('/api/manage/reviews/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  items: [],
  featured: [], // NEW: State to hold featured products
  selectedProduct: { details: null, status: 'idle', error: null },
  listStatus: 'idle',
  listError: null,
  mutationStatus: 'idle',
  mutationError: null,
  pagination: { count: 0, next: null, previous: null },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
        state.selectedProduct = initialState.selectedProduct;
    },
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.listStatus = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.results;
        state.pagination = { count: action.payload.count, next: action.payload.next, previous: action.payload.previous };
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.listStatus = 'failed'; state.listError = action.payload; })
      
      // NEW: Cases for fetching featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      
      .addCase(fetchAdminProducts.pending, (state) => { state.listStatus = 'loading'; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.results;
        state.pagination = { count: action.payload.count, next: action.payload.next, previous: action.payload.previous };
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => { state.listStatus = 'failed'; state.listError = action.payload; })

      .addCase(fetchProductById.pending, (state) => { state.selectedProduct.status = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.selectedProduct.status = 'succeeded'; state.selectedProduct.details = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.selectedProduct.status = 'failed'; state.selectedProduct.error = action.payload; })
      
      .addCase(createProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createProduct.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.items.unshift(action.payload); })
      .addCase(createProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      .addCase(updateProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedProduct.details?.id === action.payload.id) state.selectedProduct.details = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        if (state.selectedProduct.details) {
          state.selectedProduct.details.images = state.selectedProduct.details.images.filter(
            img => img.id !== action.payload.imageId
          );
        }
      })
      
      .addCase(deleteProduct.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      .addCase(addProductReview.pending, (state) => { 
        state.mutationStatus = 'loading'; 
        state.mutationError = null; 
      })
      .addCase(addProductReview.fulfilled, (state, action) => { 
        state.mutationStatus = 'succeeded';
        if (state.selectedProduct.details) {
          state.selectedProduct.details.reviews.unshift(action.payload);
        }
      })
      .addCase(addProductReview.rejected, (state, action) => { 
        state.mutationStatus = 'failed'; 
        state.mutationError = action.payload; 
      });
  },
});

export const { clearSelectedProduct, clearMutationStatus } = productsSlice.actions;
export default productsSlice.reducer;
















// ordersSlice.jsx





import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// --- ASYNC THUNKS (UPDATED) ---

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api('/api/manage/orders/'); 
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch orders.');
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api('/api/manage/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // UPDATED: Corrected URL to use the /manage/ prefix
      const response = await api(`/api/manage/orders/${orderId}/update-status/`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update order status.');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- SLICE DEFINITION (no changes needed here) ---
const initialState = {
  items: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  updateStatus: 'idle',
  updateError: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetCreateStatus(state) {
        state.createStatus = 'idle';
        state.createError = null;
    },
    resetUpdateStatus(state) {
        state.updateStatus = 'idle';
        state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(createOrder.pending, (state) => { state.createStatus = 'loading'; state.createError = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.createStatus = 'succeeded'; state.items.unshift(action.payload); })
      .addCase(createOrder.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.payload; })
      .addCase(updateOrderStatus.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.items.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload; });
  },
});

export const { resetCreateStatus, resetUpdateStatus } = ordersSlice.actions;
export default ordersSlice.reducer;












// heroSlice.jsx









import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the api utility

// --- ASYNC THUNKS ---
// UPDATED: This thunk now uses the 'api' utility to ensure correct request context.
export const fetchHeroSlides = createAsyncThunk(
  'hero/fetchSlides',
  async (_, { rejectWithValue }) => {
    try {
      // The backend view already handles filtering for active/all slides based on user role.
      // We just need to call the single endpoint.
      const response = await api('/api/hero-slides/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch hero slides.');
      }
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createHeroSlide = createAsyncThunk(
  'hero/createSlide',
  async (slideFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/hero-slides/', {
        method: 'POST',
        body: slideFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHeroSlide = createAsyncThunk(
  'hero/updateSlide',
  async ({ slideId, slideFormData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/hero-slides/${slideId}/`, {
        method: 'PUT',
        body: slideFormData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHeroSlide = createAsyncThunk(
  'hero/deleteSlide',
  async (slideId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/hero-slides/${slideId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return slideId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  slides: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
  mutationError: null,
};

const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchHeroSlides.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => { 
        state.status = 'succeeded'; 
        state.slides = action.payload;
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Create cases
      .addCase(createHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createHeroSlide.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.slides.push(action.payload); })
      .addCase(createHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      // Update cases
      .addCase(updateHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateHeroSlide.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.slides.findIndex(slide => slide.id === action.payload.id);
        if (index !== -1) {
          state.slides[index] = action.payload;
        }
      })
      .addCase(updateHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      // Delete cases
      .addCase(deleteHeroSlide.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteHeroSlide.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.slides = state.slides.filter(slide => slide.id !== action.payload);
      })
      .addCase(deleteHeroSlide.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; });
  },
});

export const { clearMutationStatus } = heroSlice.actions;
export default heroSlice.reducer;












// filterSlice.jsx



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- ASYNC THUNKS for COLORS ---

// Public endpoint
export const fetchColors = createAsyncThunk('filters/fetchColors', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/colors/`);
    if (!response.ok) throw new Error('Failed to fetch colors.');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const createColor = createAsyncThunk('filters/createColor', async (colorData, { rejectWithValue }) => {
  try {
    const response = await api('/api/colors/', {
      method: 'POST',
      body: JSON.stringify(colorData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const deleteColor = createAsyncThunk('filters/deleteColor', async (colorId, { rejectWithValue }) => {
  try {
    const response = await api(`/api/colors/${colorId}/`, {
      method: 'DELETE',
    });
    if (response.status !== 204) {
      const data = await response.json();
      throw new Error(JSON.stringify(data));
    }
    return colorId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


// --- ASYNC THUNKS for SIZES ---

// Public endpoint
export const fetchSizes = createAsyncThunk('filters/fetchSizes', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sizes/`);
    if (!response.ok) throw new Error('Failed to fetch sizes.');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// UPDATED: Uses the 'api' wrapper
export const createSize = createAsyncThunk('filters/createSize', async (sizeData, { rejectWithValue }) => {
    try {
      const response = await api('/api/sizes/', {
        method: 'POST',
        body: JSON.stringify(sizeData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
// UPDATED: Uses the 'api' wrapper
export const deleteSize = createAsyncThunk('filters/deleteSize', async (sizeId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/sizes/${sizeId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return sizeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });


// --- SLICE DEFINITION ---

const initialState = {
  colors: { items: [], status: 'idle', error: null },
  sizes: { items: [], status: 'idle', error: null },
  mutationStatus: 'idle',
  mutationError: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Color Fetch
      .addCase(fetchColors.pending, (state) => { state.colors.status = 'loading'; })
      .addCase(fetchColors.fulfilled, (state, action) => { state.colors.status = 'succeeded'; state.colors.items = action.payload; })
      .addCase(fetchColors.rejected, (state, action) => { state.colors.status = 'failed'; state.colors.error = action.payload; })
      // Size Fetch
      .addCase(fetchSizes.pending, (state) => { state.sizes.status = 'loading'; })
      .addCase(fetchSizes.fulfilled, (state, action) => { state.sizes.status = 'succeeded'; state.sizes.items = action.payload; })
      .addCase(fetchSizes.rejected, (state, action) => { state.sizes.status = 'failed'; state.sizes.error = action.payload; })
      
      // Color Create
      .addCase(createColor.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createColor.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.colors.items.push(action.payload); })
      .addCase(createColor.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      // Color Delete
      .addCase(deleteColor.fulfilled, (state, action) => { state.colors.items = state.colors.items.filter(c => c.id !== action.payload); })
      
      // Size Create
      .addCase(createSize.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createSize.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.sizes.items.push(action.payload); })
      .addCase(createSize.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      // Size Delete
      .addCase(deleteSize.fulfilled, (state, action) => { state.sizes.items = state.sizes.items.filter(s => s.id !== action.payload); });
  },
});

export const { clearMutationStatus } = filtersSlice.actions;
export default filtersSlice.reducer;










// categoriesSlice.jsx




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Import the new api utility

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// --- ASYNC THUNKS ---

// Public endpoint, no changes needed here
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/`);
      if (!response.ok) throw new Error('Failed to fetch categories.');
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryFormData, { rejectWithValue }) => {
    try {
      const response = await api('/api/categories/', {
        method: 'POST',
        body: categoryFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, categoryFormData }, { rejectWithValue }) => {
    try {
      const response = await api(`/api/categories/${categoryId}/`, {
        method: 'PUT',
        body: categoryFormData,
        headers: {}, // Override default 'Content-Type: application/json' for FormData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// UPDATED: Uses the 'api' wrapper
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api(`/api/categories/${categoryId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        const data = await response.json();
        throw new Error(JSON.stringify(data));
      }
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  items: [],
  status: 'idle',
  error: null,
  mutationStatus: 'idle',
  mutationError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearMutationStatus(state) {
        state.mutationStatus = 'idle';
        state.mutationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchCategories.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      // Create cases
      .addCase(createCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(createCategory.fulfilled, (state, action) => { state.mutationStatus = 'succeeded'; state.items.push(action.payload); })
      .addCase(createCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })
      
      // Update cases
      .addCase(updateCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        const index = state.items.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; })

      // Delete cases
      .addCase(deleteCategory.pending, (state) => { state.mutationStatus = 'loading'; state.mutationError = null; })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded';
        state.items = state.items.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => { state.mutationStatus = 'failed'; state.mutationError = action.payload; });
  },
});

export const { clearMutationStatus } = categoriesSlice.actions;
export default categoriesSlice.reducer;












// cartSlice.jsx




// store/cartSlice.jsx

import { createSlice } from '@reduxjs/toolkit';

// Function to get cart data from localStorage
const getCartFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [], totalQuantity: 0, totalAmount: 0 };
    }
    const cart = JSON.parse(serializedState);
    // Ensure totalAmount is a number
    cart.totalAmount = Number(cart.totalAmount) || 0;
    return cart;
  } catch (e) {
    console.warn("Could not load cart from storage", e);
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

// Function to save cart data to localStorage
const saveCartToStorage = (cartState) => {
  try {
    const serializedState = JSON.stringify(cartState);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.warn("Could not save cart to storage", e);
  }
};


const initialState = getCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      // Removed .toString().replace('$', '') as backend sends clean numeric strings
      const price = parseFloat(newItem.price);
      if (isNaN(price)) return; // Don't add if price is invalid

      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: price, // Use the parsed price
          quantity: 1,
          totalPrice: price, // Initial total price for this item
          name: newItem.name,
          image: newItem.image_url, // Use image_url from backend
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += price;
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      saveCartToStorage(state);
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return; // Do nothing if item not in cart

      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice -= existingItem.price;
      }

      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      saveCartToStorage(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state);
    }
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;









// authSlice.jsx












import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const API_BASE_URL = 'http://127.0.0.1:8000';

// --- HELPER FUNCTIONS ---
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (user && accessToken && refreshToken) {
      return { user: JSON.parse(user), accessToken, refreshToken, isAuthenticated: true };
    }
  } catch (e) { console.warn("Could not load user from storage", e); }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
};

// --- ASYNC THUNKS ---

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      const userResponse = await fetch(`${API_BASE_URL}/auth/users/me/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userResponse.json();
      if (!userResponse.ok) return rejectWithValue(userData);
      const payload = { user: userData, accessToken: data.access, refreshToken: data.refresh };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      return payload;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => { /* ... */ });

// UPDATED: Corrected URL to use the /manage/ prefix
export const fetchWishlist = createAsyncThunk('auth/fetchWishlist', async (_, { rejectWithValue }) => {
    try {
        const response = await api('/api/manage/wishlist/');
        if (!response.ok) return rejectWithValue(await response.json());
        return await response.json();
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});

// UPDATED: Corrected URL to use the /manage/ prefix
export const addToWishlist = createAsyncThunk('auth/addToWishlist', async ({ productId, product }, { rejectWithValue }) => {
    try {
        const response = await api(`/api/manage/wishlist/${productId}/add/`, { method: 'POST' });
        if (!response.ok) return rejectWithValue(await response.json());
        return product;
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});

// UPDATED: Corrected URL to use the /manage/ prefix
export const removeFromWishlist = createAsyncThunk('auth/removeFromWishlist', async (productId, { rejectWithValue }) => {
    try {
        const response = await api(`/api/manage/wishlist/${productId}/remove/`, { method: 'POST' });
        if (!response.ok) return rejectWithValue(await response.json());
        return { productId };
    } catch (error) {
        return rejectWithValue(error.toString());
    }
});


// --- SLICE DEFINITION ---

const initialState = {
  ...getUserFromStorage(),
  status: 'idle',
  error: null,
  wishlist: { items: [], status: 'idle', error: null }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokenRefreshed(state, action) {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      state.wishlist = initialState.wishlist;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => { /* ... */ })
      .addCase(fetchWishlist.pending, (state) => { state.wishlist.status = 'loading'; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.wishlist.status = 'succeeded'; state.wishlist.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.wishlist.status = 'failed'; state.wishlist.error = action.payload; })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.wishlist.items.some(item => item.id === action.payload.id)) {
            state.wishlist.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist.items = state.wishlist.items.filter(
            (item) => item.id !== action.payload.productId
        );
      });
  },
});

export const { logout, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;











// api.js




import { tokenRefreshed, logout } from '../store/authSlice';

const API_BASE_URL = 'http://127.0.0.1:8000';

// FIXED: Declare 'store' with 'let' so it can be assigned later.
let store;

// An exported function that allows us to inject the store
export const injectStore = (_store) => {
  store = _store;
};

// This is our custom fetch wrapper
const api = async (url, options = {}) => {
  // Get the current token from the injected Redux store
  let token = store.getState().auth.accessToken;

  // Set up the initial headers
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the initial request
  let response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  // Check if the token expired (401 Unauthorized)
  if (response.status === 401) {
    console.log('Access token expired. Attempting to refresh...');
    const refreshToken = store.getState().auth.refreshToken;

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/jwt/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (!refreshResponse.ok) {
          throw new Error('Refresh token is invalid or expired.');
        }

        console.log('Token refreshed successfully.');
        store.dispatch(tokenRefreshed({ accessToken: refreshData.access }));
        
        headers['Authorization'] = `Bearer ${refreshData.access}`;

        console.log('Retrying the original request...');
        response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

      } catch (error) {
        console.error('Failed to refresh token:', error);
        store.dispatch(logout());
        window.location.href = '/login'; 
        return Promise.reject('Session expired. Please log in again.');
      }
    } else {
      store.dispatch(logout());
      window.location.href = '/login';
      return Promise.reject('No refresh token available. Please log in again.');
    }
  }

  return response;
};

export default api;















// App.jsx





import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Thunks
import { fetchProducts } from './store/productsSlice';
import { fetchSiteConfig } from './store/siteSlice';
import { fetchColors, fetchSizes } from './store/filtersSlice';
import { fetchCategories } from './store/categoriesSlice';
import { fetchWishlist } from './store/authSlice';
import { fetchOrders } from './store/ordersSlice';
import { fetchAllUsers, fetchRoles } from './store/usersSlice';
import { fetchHeroSlides } from './store/heroSlice';
import { fetchFeaturedProducts } from './store/productsSlice';

// Pages and Components
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import OrderHistory from './pages/dashboard/OrderHistory.jsx';
// Import Admin Components
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'; // FIXED: Added missing import
import AdminProductList from './pages/admin/AdminProductList.jsx';
import AdminProductForm from './pages/admin/AdminProductForm.jsx';
import AdminCategoryList from './pages/admin/AdminCategoryList.jsx';
import AdminOrderList from './pages/admin/AdminOrderList.jsx';
import AdminAttributesPage from './pages/admin/AdminAttributesPage.jsx';
import AdminSiteConfigPage from './pages/admin/AdminSiteConfigPage.jsx';
import AdminUserList from './pages/admin/AdminUserList.jsx';
import AdminHeroSlides from './pages/admin/AdminHeroSlides.jsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AuthLayout = ({children}) => <div className="bg-gray-100">{children}</div>;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!user?.is_staff) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSiteConfig());
    dispatch(fetchProducts());
    dispatch(fetchColors());
    dispatch(fetchSizes());
    dispatch(fetchCategories());
    dispatch(fetchHeroSlides());
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
      dispatch(fetchOrders());
      if (user?.is_staff) {
        dispatch(fetchAllUsers());
        dispatch(fetchRoles());
      }
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/Amar_dokan" element={<Layout><HomePage /></Layout>} />
        <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
        <Route path="/products/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/cart" element={<Layout><CartPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected User Routes */}
        <Route path="/wishlist" element={<ProtectedRoute><Layout><WishlistPage /></Layout></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>}>
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Layout><AdminDashboardPage /></Layout></AdminRoute>}>
            <Route path="products" element={<AdminProductList />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/edit/:productId" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategoryList />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="attributes" element={<AdminAttributesPage />} />
            <Route path="settings" element={<AdminSiteConfigPage />} />
            <Route path="users" element={<AdminUserList />} />
            <Route path="hero" element={<AdminHeroSlides />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
















// index.css




@import url('https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Yatra+One&display=swap');
@import "tailwindcss";


body {
    /* Changed to light background and dark text for the global body */
    background-color: #f5f5f5; /* Very light gray */
    color: #333333; /* Dark gray for text */
    font-family: 'Inter', sans-serif; /* Keep Inter as default font */
}
h1, h2, h3, .font-anton {
    font-family: 'Anton', sans-serif;
}


@theme {
  --color-brand-orange: #F36523; /* Your existing accent color */
  --color-brand-dark: #1a1a1a; /* Can still be used for dark elements, e.g., text on light background, or specific dark components */
  --color-brand-light: #ffffff; /* Explicitly white for light elements */
  /* Adding new utility colors for clarity in light theme */
  --color-text-primary: #333333; /* Primary text on light background */
  --color-text-secondary: #6b7280; /* Secondary text, like descriptions */
  --color-background-light: #f5f5f5; /* Light background for general sections */
  --color-background-card: #ffffff; /* White background for cards/components */
  --color-border-light: #e5e7eb; /* Light border color */
}

















// main.jsx





import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './store/store.jsx';
import { injectStore } from './utils/api'; // Import the injectStore function
import './index.css';

// Inject the store into the api utility
injectStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
