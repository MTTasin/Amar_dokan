import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAxios from '../useAxios';
import Loader from '../Components/Loader/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function OrderManagement() {
  const { userInfo, user } = useSelector((state) => state.auth);
  const { response: orders, loading, error } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/orders/`);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      setOrderList(orders);
    } else if (orders && Array.isArray(orders.data)) {
      setOrderList(orders.data);
    } else {
      setOrderList([]);
    }
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/`, { status: newStatus }, {
        headers: {
          Authorization: `JWT ${user.access}`,
        },
      });
      setOrderList(orderList.map((order) => (order.id === orderId ? res.data : order)));
      toast.success('Order status updated successfully!');
    } catch (err) {
      toast.error('Failed to update order status.');
      console.error('Update order status error:', err);
    }
  };

  if (!userInfo.is_staff && !userInfo.is_superuser) {
    return <div className="text-red-500">Access Denied: Staff or Superuser privilege required.</div>;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading orders: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-gray-600">Order ID</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">User</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Product</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Quantity</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Total</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Status</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-gray-800">{order.id}</td>
                <td className="py-2 px-4 border-b text-gray-800">{order.user}</td>
                <td className="py-2 px-4 border-b text-gray-800">{order.product}</td>
                <td className="py-2 px-4 border-b text-gray-800">{order.quantity}</td>
                <td className="py-2 px-4 border-b text-gray-800">${order.total}</td>
                <td className="py-2 px-4 border-b text-gray-800">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="p-1 border rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
