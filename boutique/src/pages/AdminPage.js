import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaUsers, FaBoxes, FaChartBar, FaCogs, FaHeadset, FaShoppingCart, FaHome, FaPalette } from 'react-icons/fa';

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
                  to="manage-users"
                  className="flex items-center text-blue-600 hover:bg-blue-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaUsers className="text-blue-500" />
                  <span className="ml-4 font-semibold">Manage Users</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="manage-orders"
                  className="flex items-center text-green-600 hover:bg-green-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaShoppingCart className="text-green-500" />
                  <span className="ml-4 font-semibold">Manage Orders</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="manage-products"
                  className="flex items-center text-yellow-600 hover:bg-yellow-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaBoxes className="text-yellow-500" />
                  <span className="ml-4 font-semibold">Manage Products</span>
                </Link>
                {/* Nested Links for Categories and Subcategories */}
                
                <ul className="ml-8">
                <li className="mb-4">
                    <Link
                      to="view-products"
                      className="flex items-center text-pink-600 hover:bg-pink-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                    >
                      <FaBoxes className="text-pink-500" />
                      <span className="ml-4 font-semibold">View products</span>
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link
                      to="manage-categories"
                      className="flex items-center text-orange-600 hover:bg-orange-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                    >
                      <FaBoxes className="text-orange-500" />
                      <span className="ml-4 font-semibold">Manage Categories</span>
                    </Link>
                  </li>
             
                  <li className="mb-4">
                    <Link
                      to="manage-subcategories"
                      className="flex items-center text-pink-600 hover:bg-pink-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                    >
                      <FaBoxes className="text-pink-500" />
                      <span className="ml-4 font-semibold">Manage Subcategories</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="mb-6">
                <Link
                  to="manage-materials"
                  className="flex items-center text-indigo-600 hover:bg-indigo-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaPalette className="text-indigo-500" />
                  <span className="ml-4 font-semibold">Manage Materials</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="business-reports"
                  className="flex items-center text-purple-600 hover:bg-purple-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaChartBar className="text-purple-500" />
                  <span className="ml-4 font-semibold">Business Reports</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="settings"
                  className="flex items-center text-red-600 hover:bg-red-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaCogs className="text-red-500" />
                  <span className="ml-4 font-semibold">Settings</span>
                </Link>
              </li>
              <li className="mb-6">
                <Link
                  to="customer-support"
                  className="flex items-center text-teal-600 hover:bg-teal-100 p-3 rounded-lg transition-colors duration-300 w-full text-left"
                >
                  <FaHeadset className="text-teal-500" />
                  <span className="ml-4 font-semibold">Customer Support</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-300 w-full text-left"
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
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Welcome to the Admin Panel</h2>
            <Outlet /> {/* This renders the nested route components */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
