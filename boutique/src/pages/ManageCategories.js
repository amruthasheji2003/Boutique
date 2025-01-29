import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Fetch existing categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/category'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCategory) return;

    try {
      const response = await fetch('http://localhost:8080/api/category', { // Corrected endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const addedCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, addedCategory]); // Append new category to existing categories
      setNewCategory(''); // Clear the input field
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Manage Categories</h2>
      
      {/* Form to Add New Category */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="border border-gray-300 p-2 rounded-lg flex-1"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg ml-2 hover:bg-blue-700 transition-colors duration-300"
          >
            Add Category
          </button>
        </div>
      </form>

      {/* Display Existing Categories */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Existing Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category._id} className="mb-2 p-2 bg-gray-100 rounded-lg">
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageCategories;
