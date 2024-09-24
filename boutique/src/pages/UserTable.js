import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate for navigation

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Set loading to true before the fetch
        const response = await axios.get('http://localhost:8080/api/admin/users'); // Fetch users from the backend
        setUsers(response.data); // Set users data from the response
      } catch (error) {
        console.error("There was an error fetching the users!", error);
        setError("Failed to load users."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchUsers(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once on mount

  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px', // Add margin below the table
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#007bff',
      color: 'white',
    },
    td: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
    },
    trEven: {
      backgroundColor: '#f2f2f2',
    },
    error: {
      color: 'red',
    },
    backButton: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      textDecoration: 'none',
      marginTop: '10px', // Space above the button
    },
  };

  // Function to handle back button click
  const handleBack = () => {
    navigate('/adminpage'); // Redirect to admin page using navigate
  };

  return (
    <div style={styles.container}>
      <h2>User List</h2>
      {loading && <p>Loading users...</p>} {/* Show loading message */}
      {error && <p style={styles.error}>{error}</p>} {/* Show error message */}
      {!loading && !error && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} style={index % 2 === 0 ? styles.trEven : {}}>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phoneNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={styles.td}>No users found.</td> {/* Message if no users */}
                </tr>
              )}
            </tbody>
          </table>
          <button style={styles.backButton} onClick={handleBack}>Back</button> {/* Back button */}
        </>
      )}
    </div>
  );
};

export default UserTable;
