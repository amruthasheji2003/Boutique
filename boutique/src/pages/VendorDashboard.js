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
    quantity: '',
    unit: '',
  });
  const [error, setError] = useState({
    category: '',
    description: '',
    price: '',
    stock: '',
    quantity: '',
    unit: '',
    image: '',
    general: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

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

  const unitOptions = [
    { value: 'meters', label: 'Meters' },
    { value: 'pieces', label: 'Pieces' },
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
      setError((prev) => ({ ...prev, general: 'Failed to fetch materials.' }));
    }
  };

  const handleMaterialChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));

    // Immediate validation
    if (name === 'price' || name === 'quantity' || name === 'stock') {
      if (value <= 0) {
        setError((prev) => ({ ...prev, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be greater than zero.` }));
      } else {
        setError((prev) => ({ ...prev, [name]: '' })); // Clear error if valid
      }
    } else if (!value) {
      setError((prev) => ({ ...prev, [name]: 'This field is required.' }));
    } else {
      setError((prev) => ({ ...prev, [name]: '' })); // Clear error if valid
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setError((prev) => ({ ...prev, image: 'Please upload a valid image file.' }));
      setNewMaterial((prev) => ({ ...prev, image: null })); // Reset image if invalid
    } else {
      setError((prev) => ({ ...prev, image: '' })); // Clear error if valid
      setNewMaterial((prev) => ({ ...prev, image: file }));
    }
  };

  const validateFields = () => {
    let valid = true;
    const newError = { ...error };

    if (!newMaterial.category) {
      newError.category = 'This field is required.';
      valid = false;
    }
    if (!newMaterial.description) {
      newError.description = 'This field is required.';
      valid = false;
    }
    if (newMaterial.price <= 0) {
      newError.price = 'Price must be greater than zero.';
      valid = false;
    }
    if (newMaterial.stock <= 0) {
      newError.stock = 'Stock must be greater than zero.';
      valid = false;
    }
    if (newMaterial.quantity <= 0) {
      newError.quantity = 'Quantity must be greater than zero.';
      valid = false;
    }
    if (!newMaterial.unit) {
      newError.unit = 'This field is required.';
      valid = false;
    }

    setError(newError); // Update error state
    return valid;
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

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
      setError((prev) => ({ ...prev, general: 'Error adding material' }));
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!id) {
      console.error('No ID provided for deletion');
      setError((prev) => ({ ...prev, general: 'No ID provided for deletion' }));
      return;
    }

    console.log('Deleting material with ID:', id);
    try {
      const response = await axios.delete(`http://localhost:8080/api/materials/${id}`);
      console.log('Delete response:', response.data);
      fetchMaterials(); // Refresh materials list
      setSuccessMessage('Material deleted successfully!');
    } catch (error) {
      console.error('Error response:', error.response);
      setError((prev) => ({ ...prev, general: 'Error deleting material' }));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Onboarding Dashboard</h2>
      <form onSubmit={handleAddMaterial} style={styles.form}>
        <label htmlFor="category">Select Material Category:</label>
        <select
          id="category" // Added id
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
        {error.category && <p style={styles.error}>{error.category}</p>}

        <label htmlFor="description">Description:</label>
        <textarea
          id="description" // Added id
          name="description"
          placeholder="Description"
          value={newMaterial.description}
          onChange={handleMaterialChange}
          required
          style={styles.textarea}
        />
        {error.description && <p style={styles.error}>{error.description}</p>}

        <label htmlFor="price">Price:</label>
        <input
          id="price" // Added id
          type="number"
          name="price"
          placeholder="Price"
          value={newMaterial.price}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        {error.price && <p style={styles.error}>{error.price}</p>}

        <label htmlFor="stock">Stock Availability:</label>
        <input
          id="stock" // Added id
          type="number"
          name="stock"
          placeholder="Stock Availability"
          value={newMaterial.stock}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        {error.stock && <p style={styles.error}>{error.stock}</p>}

        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity" // Added id
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newMaterial.quantity}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        />
        {error.quantity && <p style={styles.error}>{error.quantity}</p>}

        <label htmlFor="unit">Select Unit:</label>
        <select
          id="unit" // Added id
          name="unit"
          value={newMaterial.unit}
          onChange={handleMaterialChange}
          required
          style={styles.input}
        >
          <option value="">Select Unit</option>
          {unitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error.unit && <p style={styles.error}>{error.unit}</p>}

        <label htmlFor="image">Upload Image:</label>
        <input
          id="image" // Added id
          type="file"
          onChange={handleImageChange}
          required
          style={styles.fileInput}
        />
        {error.image && <p style={styles.error}>{error.image}</p>}

        <button type="submit" style={styles.button}>Add Material</button>
        {error.general && <p style={styles.error}>{error.general}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </form>

      <h3 style={styles.libraryTitle}>Material Library</h3>
      <ul style={styles.materialList}>
        {materials.map((material) => (
          <li key={material._id} style={styles.materialItem}>
            <div style={styles.materialDetails}>
              <strong>Category:</strong> {material.category} <br />
              <strong>Description:</strong> {material.description} <br />
              <strong>Price:</strong> Rs.{material.price} <br />
              <strong>Stock:</strong> {material.stock} <br />
              <strong>Quantity:</strong> {material.quantity} <br />
              <strong>Unit:</strong> {material.unit} <br />
              {/* Update the image source to use the correct URL */}
              <div className="md:flex-shrink-0">
              <img 
                  className="h-64 w-full object-cover md:w-64" 
                  src={`http://localhost:8080/${material.image.replace('\\', '/')}`} // Replace backslash with forward slash
                  alt={material.description} 
                  style={styles.materialImage} 
                />
              </div>
            </div>
            <button onClick={() => handleDeleteMaterial(material._id)} style={styles.deleteButton}>Delete</button>
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
  materialImage: {
    maxWidth: '100px', // Set a max width for the material image
    height: 'auto', // Maintain aspect ratio
  },
};

export default VendorDashboard;