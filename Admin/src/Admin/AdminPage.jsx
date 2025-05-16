import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar'
import Add from './pages/Add'
import Order from './pages/Order'
import List from './pages/List'
import Sidebar from './Sidebar/Sidebar'

const AdminPage = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-container">
        <div className="flex">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/add" element={<Add />} />
              <Route path="/order" element={<Order />} />
              <Route path="/list" element={<List />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
