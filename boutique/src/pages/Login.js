import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa'; // Search and Back icons
import backgroundImage from '../assets/loginimage.avif'; // Adjust the path as necessary
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search bar
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    let valid = true;
    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    try {
      const adminResponse = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminResponse.json();

      if (adminResponse.status === 200 && adminData.admin) {
        localStorage.setItem('token', adminData.token);
        setSuccessMessage('Admin login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
        return;
      }

      const userResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userResponse.json();
      console.log(userData);
      if (userResponse.status === 200) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.user.userId);
        localStorage.setItem('name', userData.user.firstName); 
        setSuccessMessage('User login successful! Redirecting...');
        setTimeout(() => {
          navigate('/browse-catalog');
        }, 2000);

      } else {
        setEmailError(userData.message || 'Login failed');
      }
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSearch = () => {
    console.log('Search query:', searchQuery); // Handle search action
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div>
      {/* Header Section */}
      <header className='h-20 shadow-md bg-white fixed w-full z-30'>
        <div className='container mx-auto flex items-center justify-between px-4 h-full'>
          {/* Logo Section */}
          <div className='flex items-center'>
            <Link to="/">
              <img src={logo} alt="Tailor's Touch Logo" className="h-12 mr-2" />
            </Link>
            <Link to="/" className='text-green-600 text-3xl font-bold hover:text-pink-500 transition-colors duration-300'>
              Tailor's Touch Boutique
            </Link>
          </div>

          {/* Navigation Links */}
          <div className='flex items-center space-x-20'>
            <Link to="/" className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>Home</Link>
            <Link to="/contact-us" className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>Contact Us</Link>
            <Link to="/about-us" className='text-gray-700 hover:text-blue-500 transition-colors duration-300'>About Us</Link>
          </div>

          {/* Back Button */}
          <button onClick={handleBack} className='text-gray-600 hover:text-gray-900 transition-colors duration-300'>
            <FaArrowLeft size={20} />
          </button>

          {/* Search Bar
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='border border-gray-300 rounded-full px-4 py-2 focus:outline-none'
              />
              <FaSearch className='absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400' />
            </div>
          </div> */}
        </div>
      </header>

      {successMessage && (
        <div style={styles.notificationBox}>
          <p style={styles.notificationMessage}>{successMessage}</p>
        </div>
      )}
background
      <main className='min-h-[calc(100vh-60px)] pt-0' style={{ ...styles.container, backgroundImage: `url(${backgroundImage})` }}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Login</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>
                Email/Username
                {emailError && <span style={styles.error}>{emailError}</span>}
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
                {passwordError && <span style={styles.error}>{passwordError}</span>}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>Login</button>
          </form>

          <button onClick={handleGoogleSignIn} style={styles.googleButton}>
            Sign in with Google
          </button>
          <p onClick={handleForgotPassword} style={styles.forgotPassword}>
            Forgot Password?
          </p>
          <Link to="/Registration" style={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '300px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    display: 'block',
    fontSize: '12px',
  },
  notificationBox: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '8px',
    padding: '10px 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    width: '250px',
    textAlign: 'center',
  },
  notificationMessage: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  googleButton: {
    padding: '10px',
    backgroundColor: '#db4437',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    marginTop: '10px',
  },
  forgotPassword: {
    color: '#007bff',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '10px',
  },
  signupButton: {
    color: '#007bff',
    textAlign: 'center',
    display: 'block',
    marginTop: '10px',
  },
};

export default Login;
