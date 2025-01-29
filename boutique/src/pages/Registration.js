import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust this to match your API URL

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [phoneWarning, setPhoneWarning] = useState('');
  const [passwordWarning, setPasswordWarning] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear warnings when user starts typing again
    setError('');
    if (name === 'email') handleEmailChange(value);
    if (name === 'phoneNumber') handlePhoneChange(value);
    if (name === 'password') setPasswordWarning('');
  };

  const handleEmailChange = (value) => {
    setEmailWarning(/^[A-Z]/.test(value) ? 'Please start your email with a lowercase letter.' : '');
  };

  const handlePhoneChange = (value) => {
    setPhoneWarning(
      value.length > 0 && !/^[6-9]/.test(value)
        ? 'Phone number must start with a digit between 6 and 9.'
        : value.length !== 10
        ? 'Phone number must be exactly 10 digits.'
        : ''
    );
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordWarning('');

    if (emailWarning || phoneWarning) {
      setError('Please fix the warnings before submitting.');
      return;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(formData.password)) {
      setPasswordWarning('Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      setError('Please fix the password warning before submitting.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      if (response.status === 201) {
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      {/* Header Section */}
      <header className='h-16 shadow-md bg-yellow-900 fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div className='flex items-center gap-4'>
            <Link to="/" className='text-green text-2xl font-bold hover:text-pink-100 transition-colors duration-300'>
              Tailor's Touch Boutique
            </Link>
            <nav className='hidden lg:flex items-center space-x-40 ml-20'>
              <Link to="/" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Home</Link>
              <Link to="/featured-products" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Featured Products</Link>
              <Link to="/contact-us" className='text-white text-lg hover:text-blue-300 transition-colors duration-300'>Contact Us</Link>
            </nav>
          </div>
          <button onClick={() => navigate('/login')} className='text-white ml-4'>
            Back
          </button>
        </div>
      </header>

      {/* Registration Form */}
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              First Name
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Last Name
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
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
              {emailWarning && <p style={styles.warning}>{emailWarning}</p>}
            </label>
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
              {phoneWarning && <p style={styles.warning}>{phoneWarning}</p>}
            </label>
            <label style={styles.label}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {passwordWarning && <p style={styles.warning}>{passwordWarning}</p>}
            </label>
            <label style={styles.label}>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </label>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${require('../assets/newtt.jpg')})`,
    backgroundSize: 'cover',
    paddingTop: '100px', // Ensure content is below the fixed header
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
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
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#333',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  warning: {
    color: 'orange',
    marginTop: '5px',
    fontSize: '14px',
  },
};