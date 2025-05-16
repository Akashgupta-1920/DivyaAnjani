import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {/* This is where nested routes will render */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;