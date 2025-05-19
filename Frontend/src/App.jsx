import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Research from './pages/Research';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Loginpop from './pages/Loginpop';
import { CartProvider } from './pages/CartContext';
import CartPage from './pages/CartPage';
import PlaceOrder from './pages/PlaceOrder';
import ProductDetail from './pages/ProductDetail';

// Admin imports
import AdminLayout from './Admin/AdminLayout';
import Add from './Admin/pages/Add';
import Order from './Admin/pages/Order';
import List from './Admin/pages/List';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1 description",
    price: 99.99,
    image: "https://via.placeholder.com/300",
    category: "Category A",
    stock: 10
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2 description",
    price: 149.99,
    image: "https://via.placeholder.com/300",
    category: "Category B",
    stock: 5
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3 description",
    price: 199.99,
    image: "https://via.placeholder.com/300",
    category: "Category A",
    stock: 8
  },
  {
    id: 4,
    name: "Product 4",
    description: "This is product 4 description",
    price: 299.99,
    image: "https://via.placeholder.com/300",
    category: "Category C",
    stock: 3
  }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Using mock data instead of API call
    fetchProducts();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      // Replace API call with mock data
      // Simulating async behavior
      setTimeout(() => {
        setProducts(mockProducts);
        console.log('Products loaded from mock data');
      }, 300);
    } catch (error) {
      console.error('Error loading products:', error.message);
    }
  };

  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ToastContainer position="top-right" autoClose={3000} />
          
          {showLogin && (
            <Loginpop
              setShowLogin={setShowLogin}
              isAdminLogin={isAdminLogin}
              setIsAdminLogin={setIsAdminLogin}
              setUser={setUser}
            />
          )}
          
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            products={products}
            setShowLogin={setShowLogin}
            setIsAdminLogin={setIsAdminLogin}
            user={user}
            setUser={setUser}
          />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home searchQuery={searchQuery} products={products} />} />
              <Route path="/research" element={<Research />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products searchQuery={searchQuery} setSearchQuery={setSearchQuery} products={products} />} />
              <Route path="/product/:productId" element={<ProductDetail products={products} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<PlaceOrder />} />
              
              {/* Admin section with nested routes */}
              <Route path="/admin/dashboard" element={<AdminLayout user={user} />}>
                <Route index element={<Navigate to="list" replace />} />
                <Route path="add" element={<Add />} />
                <Route path="orders" element={<Order />} />
                <Route path="list" element={<List products={products} setProducts={setProducts} />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;