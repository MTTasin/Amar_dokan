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
