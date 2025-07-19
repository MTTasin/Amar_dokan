import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAxios from '../useAxios';
import Loader from '../Components/Loader/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const { userInfo, user } = useSelector((state) => state.auth);
  const { response: users, loading, error } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/auth/users/`);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (Array.isArray(users)) {
      setUserList(users);
    } else if (users && Array.isArray(users.data)) {
      setUserList(users.data);
    } else {
      setUserList([]);
    }
  }, [users]);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await axios.delete(`${process.env.VITE_API_BASE_URL}/auth/users/${userId}/`, {
        headers: {
          Authorization: `JWT ${user.access}`,
        },
      });
      setUserList(userList.filter((u) => u.id !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete user.');
      console.error('Delete user error:', err);
    }
  };

  if (!userInfo.is_superuser) {
    return <div className="text-red-500">Access Denied: Superuser privilege required.</div>;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading users: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left text-gray-600">ID</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Email</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">First Name</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Last Name</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Staff</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Superuser</th>
              <th className="py-2 px-4 border-b text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-gray-800">{u.id}</td>
                <td className="py-2 px-4 border-b text-gray-800">{u.email}</td>
                <td className="py-2 px-4 border-b text-gray-800">{u.first_name}</td>
                <td className="py-2 px-4 border-b text-gray-800">{u.last_name}</td>
                <td className="py-2 px-4 border-b text-gray-800">{u.is_staff ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b text-gray-800">{u.is_superuser ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
