import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://boutique-backend-j6re.onrender.com'; // Adjust this to match your backend URL

const ManageUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const usersPerPage = 6;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
                setFilteredUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch(e.target.value);
    };

    const handleSearch = (term) => {
        const filtered = users.filter(user => 
            user.email.toLowerCase().startsWith(term.toLowerCase()) || 
            user.phoneNumber.startsWith(term)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
        pageNumbers.push(i);
    }

    const nextPage = () => {
        if (currentPage < pageNumbers.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Manage Users</h1>

            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    placeholder="Search users by email or phone number"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    className="border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 p-3 rounded-lg flex-grow"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead className="bg-blue-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
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
                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={prevPage}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === 1}
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === number ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={nextPage}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage === pageNumbers.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={currentPage === pageNumbers.length}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ManageUsers;