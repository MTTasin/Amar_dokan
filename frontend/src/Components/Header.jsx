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
