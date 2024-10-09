import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Holds the current search term
    const [users, setUsers] = useState([]); // Holds the full list of users
    const [filteredUsers, setFilteredUsers] = useState([]); // Holds the filtered list of users
    const [currentPage, setCurrentPage] = useState(1); // Holds the current page number
    const usersPerPage = 6; // Define how many users to display per page

    const navigate = useNavigate(); // Hook to handle navigation

    useEffect(() => {
        // Fetch all users when the component mounts
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Ensure the token is stored in local storage upon admin login
                const response = await axios.get('http://localhost:8080/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send the token in the headers
                    },
                });
                setUsers(response.data); // Set the full user data
                setFilteredUsers(response.data); // Initially show all users
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle the search button click
    const handleSearch = () => {
        // Filter users based on the search term (either email or phone number)
        const filtered = users.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.phoneNumber.includes(searchTerm)
        );
        setFilteredUsers(filtered); // Update the filtered users state
        setCurrentPage(1); // Reset to the first page after searching
    };

    // Get current users to display on the current page
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Handle clicking the "Next" button to load the next set of users
    const nextPage = () => {
        if (indexOfLastUser < filteredUsers.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    // Handle clicking the "Previous" button to load the previous set of users
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Back button at the top */}
            <button 
                onClick={() => navigate(-1)} // Navigate back to the previous page
                className="bg-gray-300 text-black px-4 py-2 mb-4"
            >
                Back
            </button>

            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

            {/* Input field for searching users by email or phone number */}
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    placeholder="Search users by email or phone number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Only set the search term
                    className="border p-2 w-full"
                />
                <button 
                    onClick={handleSearch} // Search when the button is clicked
                    className="bg-blue-500 text-white px-4 py-2"
                >
                    Search
                </button>
            </div>

            {/* Table to display the users */}
            <table className="min-w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map(user => (
                            <tr key={user._id} className="border-b">
                                <td className="border px-4 py-2">{user.email}</td>
                                <td className="border px-4 py-2">{user.phoneNumber}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center py-2">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex justify-between mt-4">
                <button 
                    onClick={prevPage}
                    className={`px-4 py-2 bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button 
                    onClick={nextPage}
                    className={`px-4 py-2 bg-blue-500 text-white ${indexOfLastUser >= filteredUsers.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={indexOfLastUser >= filteredUsers.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageUsers;