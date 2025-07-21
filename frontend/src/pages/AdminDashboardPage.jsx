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
