import React, { useState } from 'react';

export default function ManageVendors() {
  const [vendor, setVendor] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevVendor) => ({
      ...prevVendor,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Vendor Info:', vendor);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Vendor Management</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vendor Name:</label>
          <input
            type="text"
            name="name"
            value={vendor.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter vendor name"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vendor Email:</label>
          <input
            type="email"
            name="email"
            value={vendor.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter vendor email"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Vendor Phone:</label>
          <input
            type="tel"
            name="phone"
            value={vendor.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter vendor phone"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Vendor
        </button>
      </form>
    </div>
  );
}
