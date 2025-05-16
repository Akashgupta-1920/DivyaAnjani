import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully!");
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-gray-900 text-white shadow-md z-10">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.name || 'Admin'}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;