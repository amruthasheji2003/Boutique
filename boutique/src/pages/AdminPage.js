import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBoxes, FaChartBar, FaCogs, FaHeadset, FaShoppingCart, FaHome } from 'react-icons/fa';

const AdminPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 h-16 flex items-center justify-between px-6 shadow-md">
        <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
        <Link to="/" className="text-white hover:bg-blue-700 p-2 rounded transition-colors duration-300">
          Logout
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-white w-64 shadow-lg border-r">
          <nav className="mt-8">
            <ul>
              <li className="mb-6">
                <Link
                  to='/manage-users'
                  className="flex items-center text-blue-600 hover:bg-blue-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaUsers className="text-blue-500" />
                  <span className="ml-4 font-semibold">Manage Customers</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="/manage-orders"
                  className="flex items-center text-green-600 hover:bg-green-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaShoppingCart className="text-green-500" />
                  <span className="ml-4 font-semibold">Manage Orders</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="/manage-products"
                  className="flex items-center text-yellow-600 hover:bg-yellow-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaBoxes className="text-yellow-500" />
                  <span className="ml-4 font-semibold">Manage Products</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="/admin/reports"
                  className="flex items-center text-purple-600 hover:bg-purple-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaChartBar className="text-purple-500" />
                  <span className="ml-4 font-semibold">Business Reports</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="/admin/settings"
                  className="flex items-center text-red-600 hover:bg-red-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaCogs className="text-red-500" />
                  <span className="ml-4 font-semibold">Settings</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="/admin/support"
                  className="flex items-center text-teal-600 hover:bg-teal-100 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaHeadset className="text-teal-500" />
                  <span className="ml-4 font-semibold">Customer Support</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-300"
                >
                  <FaHome className="text-gray-500" />
                  <span className="ml-4 font-semibold">Home</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-10 bg-gray-50">
          <div className="bg-white p-8 shadow-md rounded-lg">
            {/* Add content like charts, tables, summaries, etc. */}
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Welcome to the Admin Panel</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
