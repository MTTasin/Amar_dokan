import React from 'react';
import { useSelector } from 'react-redux';
import useAxios from '../useAxios';
import Loader from '../Components/Loader/Loader';

export default function DashboardOverview() {
  const { userInfo } = useSelector((state) => state.auth);
  const { response: products, loading: productsLoading, error: productsError } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/`);
  const { response: users, loading: usersLoading, error: usersError } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/auth/users/`);
  const { response: orders, loading: ordersLoading, error: ordersError } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/orders/`);

  if (productsLoading || usersLoading || ordersLoading) {
    return <Loader />;
  }

  if (productsError || usersError || ordersError) {
    return <div className="text-red-500">Error loading dashboard data.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-blue-600">{products ? products.length : 0}</p>
        </div>
        {userInfo.is_superuser && (
          <div className="bg-green-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-green-600">{users ? users.length : 0}</p>
          </div>
        )}
        {(userInfo.is_staff || userInfo.is_superuser) && (
          <div className="bg-yellow-100 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">Total Orders</h3>
            <p className="text-4xl font-bold text-yellow-600">{orders ? orders.length : 0}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {userInfo.first_name}!</h3>
        <p className="text-gray-600">This is your dashboard. Use the sidebar to navigate through different management sections.</p>
      </div>
    </div>
  );
}
