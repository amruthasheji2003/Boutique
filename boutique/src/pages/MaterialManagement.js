import React, { useState } from 'react';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([
    // { name: 'Cotton', color: 'White' },
    // { name: 'Silk', color: 'Red' }
  ]);
  const [newMaterial, setNewMaterial] = useState({ name: '', color: '' });

  const handleAddMaterial = () => {
    setMaterials([...materials, newMaterial]);
    setNewMaterial({ name: '', color: '' });
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-indigo-600">Material Management</h2>
      
      {/* Display Material List */}
      <ul className="mb-4">
        {materials.map((material, index) => (
          <li key={index} className="mb-2">
            {material.name} - <span className="text-indigo-600">{material.color}</span>
          </li>
        ))}
      </ul>

      {/* Add New Material */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Material Name"
          value={newMaterial.name}
          onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
          className="border border-gray-300 p-2 rounded-l"
        />
        <input
          type="text"
          placeholder="Color"
          value={newMaterial.color}
          onChange={(e) => setNewMaterial({ ...newMaterial, color: e.target.value })}
          className="border border-gray-300 p-2 rounded-r"
        />
        <button onClick={handleAddMaterial} className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded">
          Add Material
        </button>
      </div>
    </div>
  );
};

export default MaterialManagement;
