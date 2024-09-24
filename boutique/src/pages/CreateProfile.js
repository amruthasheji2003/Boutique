import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    gender: '',
    state: '',
    district: '',
    city: '',
    address: '',
    postalcode: '',
  });
  const [error, setError] = useState(''); // To capture any errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('/api/Profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'), // Include token if necessary
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const result = await response.json();
      console.log('Profile created:', result);
      navigate('/customer');
    } catch (err) {
      setError(err.message);
      console.error('Error creating profile:', err);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={styles.container}>
      <button onClick={handleBackClick} style={styles.backButton}>
        &#8592; Back
      </button>
      <h1 style={styles.heading}>Create Profile</h1>
      {error && <p style={styles.error}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.partitions}>
          <div style={styles.partition}>
            {['firstname', 'lastname', 'email', 'mobile', 'gender'].map((key) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.label}>{formatLabel(key)}:</label>
                {key === 'gender' ? (
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                )}
              </div>
            ))}
          </div>
          <div style={styles.partition}>
            {['state', 'district', 'city', 'address', 'postalcode'].map((key) => (
              <div key={key} style={styles.formGroup}>
                <label style={styles.label}>{formatLabel(key)}:</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

// Helper function to format label text
const formatLabel = (label) => {
  return label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundImage: `url(${require('../assets/home13.jpg')})`,
    backgroundSize: 'cover',
    padding: '20px',
    boxSizing: 'border-box',
    backdropFilter: 'blur(5px)', // Add a blur effect for better readability
  },
  backButton: {
    position: 'absolute', // Position the button absolutely
    top: '20px', // Set it to the top
    left: '20px', // Set it to the left
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    border: 'none',
    background: 'none', // No background color
    color: '#333', // Dark color for the back button
    cursor: 'pointer',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#fff', // Changed to white for contrast
  },
  error: {
    color: 'red', // Style for error messages
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '800px',
    background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background for form
    borderRadius: '10px',
    padding: '20px', // Added padding for better spacing
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow effect
  },
  partitions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  partition: {
    flex: '1',
    margin: '0 10px',
  },
  formGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  label: {
    flex: '1',
    display: 'block',
    marginRight: '10px',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#333', // Dark gray for better visibility
  },
  input: {
    flex: '2',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Smooth transition for hover
  },
};

export default CreateProfile;
