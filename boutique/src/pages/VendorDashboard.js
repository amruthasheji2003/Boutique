// src/pages/VendorDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import logo from '../assets/logo.png'; // Adjust the path to your logo image

const VendorDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
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
  const [deleteMessage, setDeleteMessage] = useState(''); // State for delete message
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const navigate = useNavigate(); // Hook for navigation

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
    setNewMaterial((prev) => ({ ...prev, [name]: value }));fetchMaterials

    // Immediate validation for all fields
    let newError = { ...error };

    if (name === 'price') {
        if (value <= 0) {
            newError.price = 'Price must be greater than zero.';
        } else {
            newError.price = ''; // Clear error if valid
        }
    } else if (name === 'stock') {
        if (value <= 0 || value > 500) {
            newError.stock = 'Stock must be greater than zero and less than or equal to 500.';
        } else {
            newError.stock = ''; // Clear error if valid
        }
    } else if (name === 'quantity') {
        if (value <= 0 || value > 2500) {
            newError.quantity = 'Quantity must be greater than zero and less than or equal to 2500.';
        } else {
            newError.quantity = ''; // Clear error if valid
        }
    } else if (!value) {
        newError[name] = 'This field is required.';
    } else {
        newError[name] = ''; // Clear error if valid
    }

    setError(newError); // Update error state
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
    if (newMaterial.stock <= 0 || newMaterial.stock > 500) {
        newError.stock = 'Stock must be greater than zero and less than or equal to 500.';
        valid = false;
    }
    if (newMaterial.quantity <= 0 || newMaterial.quantity > 2500) {
        newError.quantity = 'Quantity must be greater than zero and less than or equal to 2500.';
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
      setDeleteMessage('Material deleted successfully!'); // Set delete message
      setTimeout(() => setDeleteMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error response:', error.response);
      setError((prev) => ({ ...prev, general: 'Error deleting material' }));
    }
  };

  const handleLogout = () => {
    // Implement logout functionality
    localStorage.removeItem('token'); // Remove token from local storage
    navigate('/vendor-login'); // Navigate to vendor login page
  };

  // Pagination Logic
  const indexOfLastMaterial = currentPage * itemsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirstMaterial, indexOfLastMaterial);
  const totalPages = Math.ceil(materials.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Search Logic
  const filteredMaterials = materials.filter(material => 
    material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-4" />
            </Link>
            <Link to="/" className='text-green text-3xl font-bold hover:text-pink-100 transition-colors duration-300'>
              Tailor's Touch Boutique
            </Link>
          </div>
          {/* Logout Button */}
          <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300'>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <h2 style={styles.title}>Onboarding Dashboard</h2>
        <form onSubmit={handleAddMaterial} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="category">Select Material Category:</label>
            <select
              id="category"
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
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={newMaterial.description}
              onChange={handleMaterialChange}
              required
              style={styles.textarea}
            />
            {error.description && <p style={styles.error}>{error.description}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Price"
              value={newMaterial.price}
              onChange={handleMaterialChange}
              required
              style={styles.input}
            />
            {error.price && <p style={styles.error}>{error.price}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="stock">Stock Availability:</label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Stock Availability"
              value={newMaterial.stock}
              onChange={handleMaterialChange}
              required
              style={styles.input}
            />
            {error.stock && <p style={styles.error}>{error.stock}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newMaterial.quantity}
              onChange={handleMaterialChange}
              required
              style={styles.input}
            />
            {error.quantity && <p style={styles.error}>{error.quantity}</p>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="unit">Select Unit:</label>
            <select
              id="unit"
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
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="image">Upload Image:</label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              required
              style={styles.fileInput}
            />
            {error.image && <p style={styles.error}>{error.image}</p>}
          </div>

          <button type="submit" style={styles.button}>Add Material</button>
          {error.general && <p style={styles.error}>{error.general}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
        </form>

        {/* Search Input */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Delete Message */}
        {deleteMessage && <p style={styles.success}>{deleteMessage}</p>}

        <h3 style={styles.libraryTitle}>Material Library</h3>
        <ul style={styles.materialList}>
          {filteredMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial).map((material) => (
            <li key={material._id} style={styles.materialItem}>
              <div style={styles.imageContainer}>
                <img 
                  className="material-image" 
                  src={`http://localhost:8080/${material.image.replace('\\', '/')}`} // Replace backslash with forward slash
                  alt={material.description} 
                  style={styles.materialImage} 
                />
              </div>
              <div style={styles.materialDetails}>
                <strong>Category:</strong> {material.category} <br />
                <strong>Description:</strong> {material.description} <br />
                <strong>Price:</strong> Rs.{material.price} <br />
                <strong>Stock:</strong> {material.stock} <br />
                <strong>Quantity:</strong> {material.quantity} <br />
                <strong>Unit:</strong> {material.unit} <br />
              </div>
              <button onClick={() => handleDeleteMaterial(material._id)} style={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button 
              key={index + 1} 
              onClick={() => handlePageChange(index + 1)} 
              style={{
                ...styles.pageButton,
                backgroundColor: currentPage === index + 1 ? '#007bff' : '#fff',
                color: currentPage === index + 1 ? '#fff' : '#007bff',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '700px', // Reduced container size
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    paddingTop: '80px', // Add padding to prevent overlap with fixed header
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px', // Set height for the header
    backgroundColor: '#ffffff',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  content: {
    marginTop: '80px', // Ensure content starts below the header
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
  formGroup: {
    marginBottom: '15px', // Space between form groups
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: '#fff',
    width: '100%', // Full width for inputs
  },
  textarea: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '100px',
    fontSize: '16px',
    width: '100%', // Full width for textarea
  },
  fileInput: {
    margin: '10px 0',
    width: '100%', // Full width for file input
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
  searchContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchInput: {
    padding: '10px',
    width: '80%',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
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
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s',
  },
  materialDetails: {
    flex: 1,
    marginLeft: '15px', // Added margin for spacing
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
    maxWidth: '80px', // Reduced image size
    height: 'auto', // Maintain aspect ratio
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '8px 12px',
    margin: '0 5px',
    border: '1px solid #007bff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default VendorDashboard;