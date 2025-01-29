// src/pages/VendorDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({
    category: '',
    description: '',
    price: '',
    stock: '',
    image: null,
    quantity: '', // Added quantity
    unit: '',     // Added unit
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Add this array of material categories
  const materialCategories = [
    'Fabric',
    'Laces',
    'Buttons',
    'Zippers',
    'Threads',
    'Ribbons',
    'Beads',
    'Sequins',
    'Elastic',
    'Interfacing'
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to fetch materials.');
    }
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewMaterial((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newMaterial).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post('http://localhost:8080/api/materials/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Material added successfully!');
      fetchMaterials(); // Refresh materials list
      setNewMaterial({ category: '', description: '', price: '', stock: '', image: null, quantity: '', unit: '' }); // Reset state
    } catch (error) {
      setError('Error adding material');
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!id) {
      console.error('No ID provided for deletion'); // Log if ID is undefined
      setError('No ID provided for deletion');
      return;
    }

    console.log('Deleting material with ID:', id); // Log the ID
    try {
      const response = await axios.delete(`http://localhost:8080/api/materials/${id}`); // Corrected template literal
      console.log('Delete response:', response.data); // Log the response
      fetchMaterials(); // Refresh materials list
      setSuccessMessage('Material deleted successfully!');
    } catch (error) {
      console.error('Error response:', error.response); // Log the error response
      setError('Error deleting material');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Onboarding Dashboard</h2>
      <form onSubmit={handleAddMaterial} style={styles.form}>
        <label htmlFor="category">Select Material Category:</label>
        <select
          name="category"
          value={newMaterial.category}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        >
          <option value="">Select Category</option>
          {materialCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={newMaterial.description}
          onChange={handleMaterialChange}
          required
          style={styles.textarea}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newMaterial.price}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock Availability"
          value={newMaterial.stock}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newMaterial.quantity}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit (e.g., meters, pieces)"
          value={newMaterial.unit}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        <input
          type="file"
          onChange={handleImageChange}
          required
          style={styles.fileInput}
        />
        <button type="submit" style={styles.button}>Add Material</button>
        {error && <p style={styles.error}>{error}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </form>

      <h3 style={styles.libraryTitle}>Material Library</h3>
      <ul style={styles.materialList}>
        {materials.map((material) => (
          <li key={material._id} style={styles.materialItem}>
            <div style={styles.materialDetails}>
              <strong>Category:</strong> {material.category} <br />
              <strong>Description:</strong> {material.description} <br />
              <strong>Price:</strong> ${material.price} <br />
              <strong>Stock:</strong> {material.stock} <br />
              <strong>Quantity:</strong> {material.quantity} <br />
              <strong>Unit:</strong> {material.unit} <br />
              <img src={material.image} alt={material.description} style={styles.materialImage} />
            </div>
            <button onClick={() => {
              console.log('Material ID clicked for deletion:', material._id); // Log the ID of the material being deleted
              handleDeleteMaterial(material._id); // Ensure the correct ID is passed
            }} style={styles.deleteButton}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fff',
  },
  textarea: {
    padding: '12px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '100px',
    fontSize: '16px',
  },
  fileInput: {
    margin: '10px 0',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    textAlign: 'center',
  },
  libraryTitle: {
    fontSize: '24px',
    margin: '20px 0',
    color: '#333',
  },
  materialList: {
    listStyleType: 'none',
    padding: 0,
  },
  materialItem: {
    padding: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  materialDetails: {
    flex: 1,
    marginRight: '10px',
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default VendorDashboard;