import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashboardLayout() {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("User Info in DashboardLayout:", userInfo);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <div className="text-2xl font-bold mb-8">Dashboard</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                    : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                }
              >
                Overview
              </NavLink>
            </li>
            {userInfo.is_superuser && (
              <li>
                <NavLink
                  to="/dashboard/users"
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                      : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                  }
                >
                  User Management
                </NavLink>
              </li>
            )}
            {(userInfo.is_staff || userInfo.is_superuser) && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/products"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                        : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                    }
                  >
                    Product Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/carousels"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                        : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                    }
                  >
                    Carousel Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/orders"
                    className={({ isActive }) =>
                      isActive
                        ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                        : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                    }
                  >
                    Order Management
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center px-4 py-2 rounded-md bg-gray-700 text-white'
                    : 'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200'
                }
              >
                My Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Renders the matched child route component */}
      </main>
    </div>
  );
}
