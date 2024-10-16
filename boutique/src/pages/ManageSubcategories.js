import React, { useState, useEffect } from 'react';

const ManageSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Fetch subcategories from the server (replace with your API endpoint)
    fetch('/api/subcategories')
      .then(response => response.json())
      .then(data => setSubcategories(data))
      .catch(error => console.error('Error fetching subcategories:', error));
  }, []);

  const handleAddSubcategory = () => {
    // Handle logic for adding a new subcategory
  };

  const handleDeleteSubcategory = (id) => {
    // Handle logic for deleting a subcategory
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Subcategories</h2>
      <button onClick={handleAddSubcategory} className="bg-blue-600 text-white p-2 rounded">Add Subcategory</button>
      <ul className="mt-4">
        {subcategories.map(subcategory => (
          <li key={subcategory._id} className="p-2 border-b">
            {subcategory.name}
            <button onClick={() => handleDeleteSubcategory(subcategory._id)} className="ml-4 text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSubcategories;
