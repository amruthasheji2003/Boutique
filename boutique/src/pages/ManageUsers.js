import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState(''); // Holds the current search term
    const [users, setUsers] = useState([]); // Holds the full list of users
    const [filteredUsers, setFilteredUsers] = useState([]); // Holds the filtered list of users
    const [currentPage, setCurrentPage] = useState(1); // Holds the current page number
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors
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
                setError('Error fetching users'); // Set error state
            } finally {
                setLoading(false); // Stop loading after fetch
            }
        };

        fetchUsers();
    }, []);

    // Handle the search input change
    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch(e.target.value); // Automatically search on input change
    };

    // Handle the search functionality
    const handleSearch = (term) => {
        // Filter users based on the search term (matching from the start of email or phone number)
        const filtered = users.filter(user => 
            user.email.toLowerCase().startsWith(term.toLowerCase()) || 
            user.phoneNumber.startsWith(term)
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

    if (loading) return <div className="text-center mt-10">Loading...</div>; // Loading state
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>; // Error handling

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Manage Users</h1>

            {/* Input field for searching users by email or phone number */}
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    placeholder="Search users by email or phone number"
                    value={searchTerm}
                    onChange={handleSearchInputChange} // Update search term and trigger search on input change
                    className="border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg flex-grow"
                />
            </div>

            {/* Table to display the users */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-blue-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone Number</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.length > 0 ? (
                            currentUsers.map(user => (
                                <tr 
                                    key={user._id} 
                                    className="hover:bg-blue-100 transition-all cursor-pointer"
                                    onClick={() => navigate(`/admin/users/${user._id}`)} // Navigate to user details on click
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-gray-500">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between mt-6">
                <button 
                    onClick={prevPage}
                    className={`px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button 
                    onClick={nextPage}
                    className={`px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all ${indexOfLastUser >= filteredUsers.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={indexOfLastUser >= filteredUsers.length}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageUsers;
