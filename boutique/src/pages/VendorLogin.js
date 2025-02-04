// src/pages/VendorLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/loginimage.avif'; // Adjust

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Example: minimum password length
  };

  const validateGSTIN = (gstin) => {
    return /^IN[a-zA-Z0-9]{13}$/.test(gstin); // Validate GSTIN format
  };

  const handleChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setError('Please enter a valid email address.');
    } else {
      setError(''); // Clear error if validation passes
    }
  };

  const handleChangePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setError('Password must be at least 6 characters long.');
    } else {
      setError(''); // Clear error if validation passes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateEmail(email) || !validatePassword(password)) {
      return; // Stop submission if validation fails
    }

    try {
      const response = await axios.post('http://localhost:8080/api/vendors/login', { email, password });
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate('/vendor-page'), 3000); // Redirect to dashboard after 3 seconds
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed. Please try again.');
      }
    }
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
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className='text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 ml-auto' // ml-auto pushes the button to the right
          >
            Back
          </button>
        </div>
      </header>

      {/* Login Form */}
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Vendor Login</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={handleChangeEmail}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Password
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChangePassword}
                style={styles.input}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
          </label>
          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button type="submit" style={styles.button}>Login</button>
          <p style={styles.footerText}>
            <span style={styles.linkText}>Don't have an account? </span>
            <Link to="/vendor-register" style={styles.link}>Register here</Link>
          </p>
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
    backgroundImage: `url(${backgroundImage})`, // Set background image
    backgroundSize: 'cover', // Cover the entire page
    backgroundPosition: 'center', // Center the background image
    color: '#fff', // Set text color to white for better contrast
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white for the form
    padding: '30px', // Increased padding for the form
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px', // Set a max width for the form
    margin: '100px auto', // Center the form with margin
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px', // Increased font size for the title
    marginBottom: '20px',
    color: '#333',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'black', // Set label text color to black
  },
  input: {
    width: '100%',
    padding: '12px', // Increased padding for inputs
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    transition: 'border-color 0.3s',
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
  footerText: {
    marginTop: '15px',
    fontSize: '14px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  linkText: {
    color: 'black', // Set link text color to black
  },
};

export default VendorLogin;