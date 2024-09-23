import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../assets/loginimage.avif'; // Adjust the path as necessary

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset errors and success message
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');
  
    // Basic validation
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
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log('Login successful', data);
        // Save token to localStorage
        localStorage.setItem('token', data.token); // Assuming the token is returned in the response
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/Customer');
        }, 2000); // Redirect after 2 seconds
      } else {
        setEmailError(data.message || 'Login failed');
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

  return (
    <div>
      {/* Small rectangular notification box */}
      {successMessage && (
        <div style={styles.notificationBox}>
          <p style={styles.notificationMessage}>{successMessage}</p>
        </div>
      )}

      <div
        style={{ ...styles.container, backgroundImage: `url(${backgroundImage})` }}
      >
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

          <button onClick={handleGoogleSignIn} style={{ ...styles.googleButton, width: '100%' }}>
            Sign in with Google
          </button>
          <p onClick={handleForgotPassword} style={styles.forgotPassword}>
            Forgot Password?
          </p>
          <Link to="/Registration" style={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
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
