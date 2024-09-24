import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate(); // Hook to navigate

  const handleBack = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1> {/* Dashboard Title */}
        <nav className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Management Options</h2> {/* Section Title */}
          <ul>
            <li>
              <Link to="/admin/UserTable" className="block py-2 hover:bg-gray-900 rounded">View Customers</Link>
            </li>
            <li>
              <Link to="/admin/RemoveUser" className="block py-2 hover:bg-gray-900 rounded">Delete Customers</Link>
            </li>
            {/* <li>
              <Link to="/admin/vendors" className="block py-2 hover:bg-gray-900 rounded">Manage Vendors</Link>
            </li> */}
            <li>
              <Link to="/admin/products" className="block py-2 hover:bg-gray-900 rounded">Manage Products</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 overflow-auto">
        {/* Header with Back and Login Buttons */}
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          {/* <button 
            onClick={handleBack} 
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button> */}
          <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
          <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </Link>
        </div>
        {/* Placeholder for future content */}
        {/* <p>Select an option from the sidebar to manage customers, vendors, or products.</p> */}
      </div>
    </div>
  );
};

export default AdminPage;
