import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/fp.avif'; // Adjust the path to your background image

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Email is required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccessMessage('Check your email for password reset instructions.');
      } else {
        setErrorMessage(data.message || 'Error sending reset email.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer} />
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Forgot Password</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email
              {errorMessage && <span style={styles.error}>{errorMessage}</span>}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Send Reset Link</button>
          {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  imageContainer: {
    flex: '0 0 40%', // Adjust the width of the image container (e.g., 40%)
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'contain', // Use 'contain' to make the image smaller and maintain aspect ratio
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent for better background visibility
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    width: '300px',
    margin: 'auto', // Center form container
    alignSelf: 'center', // Center form vertically
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
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
    color: '#555',
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
  error: {
    color: 'red',
    display: 'block',
    fontSize: '12px',
  },
  successMessage: {
    color: 'green',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default ForgotPassword;
