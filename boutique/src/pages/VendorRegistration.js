// src/pages/VendorRegistration.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

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
  const [errors, setErrors] = useState({
    organizationName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstin: '',
    phoneNumber: '',
    termsAccepted: '',
  });
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
    validateField(name, value); // Validate the field immediately
    setSuccessMessage('');
  };

  const handleCheckboxChange = () => {
    setFormData((prevState) => ({
      ...prevState,
      termsAccepted: !prevState.termsAccepted,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      termsAccepted: '', // Clear the error for terms accepted
    }));
  };

  const validateField = (name, value) => {
    let validationErrors = { ...errors };

    switch (name) {
      case 'organizationName':
        validationErrors.organizationName = value ? '' : 'Organization Name is required.';
        break;
      case 'email':
        validationErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
        break;
      case 'password':
        validationErrors.password = (value.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value))
          ? ''
          : 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        break;
      case 'confirmPassword':
        validationErrors.confirmPassword = value === formData.password ? '' : 'Passwords do not match.';
        break;
        
      case 'phoneNumber':
        validationErrors.phoneNumber = /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits.';
        break;
      default:
        break;
    }

    setErrors(validationErrors);
  };

  const validateForm = () => {
    const { organizationName, email, password, confirmPassword, gstin, phoneNumber, termsAccepted } = formData;
    let validationErrors = {
      organizationName: '',
      email: '',
      password: '',
      confirmPassword: '',
    
      phoneNumber: '',
      termsAccepted: '',
    };

    // Validate all fields
    if (!organizationName) {
      validationErrors.organizationName = 'Organization Name is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)) {
      validationErrors.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }
    
    
    if (!/^\d{10}$/.test(phoneNumber)) {
      validationErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    if (!termsAccepted) {
      validationErrors.termsAccepted = 'You must accept the terms and conditions.';
    }

    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post('http://localhost:8080/api/vendors/register', formData);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/vendor-login'), 3000); // Redirect to login after 3 seconds
    } catch (error) {
      if (error.response) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.response.data.message || 'Registration failed',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: 'Registration failed. Please try again.',
        }));
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
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-4" />
            </Link>
            <Link to="/" style={styles.boutiqueName}>
              Tailor's Touch Boutique
            </Link>
          </div>
          {/* Buttons Section */}
          <div className='flex items-center'>
            <button 
              onClick={() => navigate(-1)} 
              className='text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600'
            >
              Back
            </button>
            <button 
              onClick={handleLogin} 
              className='text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 ml-4'
            >
              Login
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
                {errors.organizationName && <p style={styles.error}>{errors.organizationName}</p>}
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
                {errors.email && <p style={styles.error}>{errors.email}</p>}
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
                {errors.password && <p style={styles.error}>{errors.password}</p>}
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
                {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
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
                {errors.gstin && <p style={styles.error}>{errors.gstin}</p>}
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
                {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber}</p>}
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
                {errors.termsAccepted && <p style={styles.error}>{errors.termsAccepted}</p>}
              </label>
            </div>
          </div>
          {errors.general && <p style={styles.error}>{errors.general}</p>}
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
    height: '80px', // Set height for the header
    backgroundColor: 'rgba(255, 255, 255, 1)', // Fully opaque background
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  boutiqueName: {
    color: 'black', // Set text color to black for visibility
    fontSize: '24px', // Adjust font size as needed
    fontWeight: 'bold', // Make the text bold
    textDecoration: 'none', // Remove underline from the link
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
    fontSize: '12px', // Smaller font size for error messages
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