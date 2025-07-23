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
                                {/* FIXED: Display order items with full details */}
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
