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
