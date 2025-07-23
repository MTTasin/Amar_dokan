import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../store/ordersSlice';
import Spinner from '../../components/Spinner';
import { Eye } from 'lucide-react';

// NEW: Modal component to display order details
const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h3 className="text-2xl font-bold mb-4 text-text-primary">Order #{order.id}</h3>
                <div className="mb-6 border-b pb-4">
                    <p><span className="font-semibold">Customer:</span> {order.user_email}</p>
                    <p><span className="font-semibold">Address:</span> {order.shipping_address}, {order.city}, {order.postal_code}</p>
                    <p><span className="font-semibold">Total:</span> ${order.total_price}</p>
                </div>
                <h4 className="text-xl font-semibold mb-4 text-text-primary">Items</h4>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 border-b pb-2">
                            <img src={item.product.image_url} alt={item.product.name} className="w-16 h-20 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-text-secondary">Qty: {item.quantity} &times; ${item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    );
};


const AdminOrderList = () => {
    const dispatch = useDispatch();
    const { items: orders, status, updateStatus } = useSelector(state => state.orders);
    const [selectedOrder, setSelectedOrder] = useState(null); // State for the modal

    useEffect(() => {
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
            {/* Render the modal */}
            <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

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
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-800">
                                        <Eye size={18} />
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

export default AdminOrderList;
