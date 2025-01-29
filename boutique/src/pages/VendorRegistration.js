// src/pages/VendorRegistration.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const VendorRegistration = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstin: '',
    phoneNumber: '',
    termsAccepted: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError('');
    setSuccessMessage('');
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      termsAccepted: !prevState.termsAccepted,
    }));
  };
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('http://localhost:8080/api/vendors/register', formData);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/vendor-login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };
  const handleLogin = () => {
    navigate('/vendor-login'); // Change this path to your actual login route
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <header style={styles.header}>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          <Link to="/" className='text-green text-3xl font-bold hover:text-pink-100 transition-colors duration-300'>
            Tailor's Touch Boutique
          </Link>
          <div>
            <button onClick={handleLogin} className='text-white ml-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
              Login
            </button>
            <button onClick={() => navigate(-1)} className='text-white ml-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'>
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Vendor Registration</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <div style={styles.leftColumn}>
              <label style={styles.label}>
                Organization Name
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </label>
              <label style={styles.label}>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </label>
              <label style={styles.label}>
                Password
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              </label>
              <label style={styles.label}>
                Confirm Password
                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              </label>
              <label style={styles.label}>
                GSTIN
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </label>
            </div>
            <div style={styles.rightColumn}>
              <label style={styles.label}>
                Phone Number
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  required
                />
                I accept the terms and conditions
              </label>
            </div>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <div className='container mx-auto text-center'>
          <p>&copy; {new Date().getFullYear()} Tailor's Touch Boutique. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    paddingTop: '80px', // To account for the fixed header height
    paddingBottom: '40px', // To provide space for the footer
    backgroundColor: '#f4f4f4', // Solid background color
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    backgroundColor: '#fbbf24', // Header background color (yellow)
    zIndex: 1000,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px', // Increased padding for the form
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '900px', // Increased max width for a wider form
    margin: '20px auto', // Center the form with margin
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px', // Increased font size for the title
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: '10px',
  },
  rightColumn: {
    flex: 1,
    marginLeft: '10px',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px', // Increased padding for inputs
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#007bff', // Color for the eye icon
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  button: {
    width: '100%',
    padding: '12px', // Increased padding for the button
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px 0',
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
};

export default VendorRegistration;
