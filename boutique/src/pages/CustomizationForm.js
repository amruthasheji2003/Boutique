import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Set the base URL for Axios to point to your backend API
axios.defaults.baseURL = 'https://boutique-backend-j6re.onrender.com'; // Adjust the port as necessary

const CustomizationForm = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [products, setProducts] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [styleAdjustments, setStyleAdjustments] = useState({
    sleeveLength: '',
    neckline: ''
  });
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(id); // Set the selected product to the ID from the URL
  const [selectedMeasurement, setSelectedMeasurement] = useState('');

  useEffect(() => {
    // Fetch products and measurements from the server
    const fetchData = async () => {
      try {
        const productResponse = await axios.get('/api/products');
        const measurementResponse = await axios.get('/api/measurements');
        setProducts(productResponse.data);
        setMeasurements(measurementResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/customizations', {
        productId: selectedProduct,
        measurementId: selectedMeasurement,
        styleAdjustments,
        additionalNotes
      });
      alert(response.data.message); // Notify user of success
      // Optionally, reset the form or redirect the user
    } catch (error) {
      console.error('Error creating customization:', error);
      alert('Error creating customization');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Customize Your Dress</h2>
      
      <label>
        Product:
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>{product.name}</option>
          ))}
        </select>
      </label>

      <label>
        Measurement:
        <select value={selectedMeasurement} onChange={(e) => setSelectedMeasurement(e.target.value)} required>
          <option value="">Select a measurement</option>
          {measurements.map(measurement => (
            <option key={measurement._id} value={measurement._id}>{measurement.name}</option>
          ))}
        </select>
      </label>

      <label>
        Sleeve Length:
        <select value={styleAdjustments.sleeveLength} onChange={(e) => setStyleAdjustments({ ...styleAdjustments, sleeveLength: e.target.value })} required>
          <option value="">Select sleeve length</option>
          <option value="short">Short</option>
          <option value="3/4">3/4</option>
          <option value="long">Long</option>
        </select>
      </label>

      <label>
        Neckline:
        <select value={styleAdjustments.neckline} onChange={(e) => setStyleAdjustments({ ...styleAdjustments, neckline: e.target.value })} required>
          <option value="">Select neckline</option>
          <option value="round">Round</option>
          <option value="v-neck">V-Neck</option>
          <option value="square">Square</option>
        </select>
      </label>

      <label>
        Additional Notes:
        <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
      </label>

      <button type="submit">Create Customization</button>
    </form>
  );
};

export default CustomizationForm;