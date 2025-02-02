// src/pages/VendorLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
          <Link to="/" className='text-green text-3xl font-bold hover:text-pink-100 transition-colors duration-300'>
            Tailor's Touch Boutique
          </Link>
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
            Don't have an account? <Link to="/vendor-register" style={styles.link}>Register here</Link>
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
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Add shadow for depth
  },
  formContainer: {
    backgroundColor: 'white',
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
    transition: 'background-color 0.3s',
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
};

export default VendorLogin;