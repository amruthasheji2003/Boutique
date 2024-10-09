import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/loginimage.avif'; // Adjust the path as necessary

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    // Validate inputs
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
      // First, attempt to log in as an admin
      const adminResponse = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const adminData = await adminResponse.json();

      if (adminResponse.status === 200 && adminData.admin) { // If admin login is successful
        console.log('Admin login successful', adminData);
        localStorage.setItem('token', adminData.token); // Store the JWT token for admin
        setSuccessMessage('Admin login successful! Redirecting...');

        setTimeout(() => {
          navigate('/admin'); // Navigate to admin dashboard
        }, 2000);
        return; // Exit function after admin login
      }

      // If admin login fails, try regular user login
      const userResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userResponse.json();

      if (userResponse.status === 200) { // If user login is successful
        console.log('User login successful', userData);
        localStorage.setItem('token', userData.token); // Store the JWT token for user
        setSuccessMessage('User login successful! Redirecting...');

        setTimeout(() => {
          navigate('/Customer'); // Navigate to customer page
        }, 2000);
      } else {
        // Show error message returned from the server
        setEmailError(userData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setEmailError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In clicked');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleBackButtonClick = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div>
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
          {/* Back Button */}
          <button onClick={handleBackButtonClick} className='text-white ml-4'>
            Back
          </button>
        </div>
      </header>

      {successMessage && (
        <div style={styles.notificationBox}>
          <p style={styles.notificationMessage}>{successMessage}</p>
        </div>
      )}

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
    marginTop: '10px',
    width: '100%',
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#007bff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  signupButton: {
    display: 'block',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '4px',
    textDecoration: 'none',
  },
};

export default Login;
