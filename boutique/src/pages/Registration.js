import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
  
    // Validation checks
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Enhanced phone number validation
    if (!phoneNumber.match(/^[2-9]{1}[0-9]{9}$/)) {
      setError('Please enter a valid 10-digit phone number starting with 2-9');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phoneNumber,
        }),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        setSuccess('Your account has been created successfully! You will be redirected to the login page shortly.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Email/Username {/* Updated label */}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Phone Number
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          <label style={styles.label}>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </label>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
      </div>
    </div>
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
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
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
  success: {
    color: 'green',
    marginBottom: '10px',
  },
};
