import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [emailWarning, setEmailWarning] = useState(''); // State for email warning
  const [phoneWarning, setPhoneWarning] = useState(''); // State for phone number warning
  const [passwordWarning, setPasswordWarning] = useState(''); // State for password warning
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Check if the first letter is capitalized
    if (value.length > 0 && /^[A-Z]/.test(value)) {
      setEmailWarning('Please start your email with a lowercase letter.');
    } else {
      setEmailWarning('');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // Check if the first digit is between 6 and 9
    if (value.length > 0 && !/^[6-9]/.test(value)) {
      setPhoneWarning('Phone number must start with a digit between 6 and 9.');
    } else if (value.length < 10) {
      setPhoneWarning('Phone number must be exactly 10 digits.');
    } else {
      setPhoneWarning('');
    }
  };

  const validatePassword = (password) => {
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordCriteria.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setPasswordWarning(''); // Reset password warning

    // Validation checks
    if (emailWarning) {
      setError('Fix the email warning before submitting.');
      return;
    }
    if (phoneWarning) {
      setError('Fix the phone number warning before submitting.');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordWarning('Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      setError('Fix the password warning before submitting.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');

        // Redirect to login page after successful registration
        navigate('/login');
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
            Email/Username
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              style={styles.input}
              required
            />
            {emailWarning && <p style={styles.warning}>{emailWarning}</p>} {/* Display email warning */}
          </label>
          <label style={styles.label}>
            Phone Number
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange} // Update to use handlePhoneChange
              style={styles.input}
              required
            />
            {phoneWarning && <p style={styles.warning}>{phoneWarning}</p>} {/* Display phone warning */}
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
            {passwordWarning && <p style={styles.warning}>{passwordWarning}</p>} {/* Display password warning */}
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
  warning: {
    color: 'orange', // Color for the warning message
    marginTop: '5px',
    fontSize: '14px',
  },
};
