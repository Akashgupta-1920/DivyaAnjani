import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import logo from '../assets/ressearch/logo.png';
import Loginpop from './Loginpop';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';

const Header = ({ searchQuery, setSearchQuery, products }) => {
  const { cartCount, cartTotal } = useCart();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currState, setCurrState] = useState("Login");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log("User from localStorage:", parsedUser); 
  
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.length > 0);
  };

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setUser(null);
    toast.success("Logged out successfully!");
    navigate('/');
  };

  const suggestions = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-[#ffffff] text-white relative">
      {/* Top Nav */}
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between md:hidden">
          <button className="text-[#69974a] text-2xl" onClick={handleToggleMenu}>
            <FaBars />
          </button>

          <Link to="/" className="flex justify-center">
            <img src={logo} alt="Suwasthi Logo" className="h-16 sm:h-10 lg:h-24 mx-auto" />
          </Link>

          <Link to="/cart" className="text-[#69974a] text-2xl relative">
            <FaShoppingCart />
            <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1">
              {cartCount}
            </span>
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
  <div className="md:hidden mt-4 bg-[#69974a] text-white shadow-md rounded-md py-4 px-6 space-y-4 animate-slide-down z-20">
    <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-[#69974a]">Home</Link>
    <Link to="/research" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-[#69974a]">About Us & Our Research</Link>
    <Link to="/products" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-[#69974a]">Products</Link>
    <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-[#69974a]">Contact Us</Link>

    {/* Admin page link */}
    {user?.isAdmin && (
      <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-medium hover:text-[#69974a]">Admin Page</Link>
    )}

    {user ? (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center mb-2 gap-2">
          <FaUser className="text-[#69974a]" />
          <span className="font-semibold">{user?.name || 'User'}</span>
        </div>

        <Link
          to="/account"
          onClick={() => setIsOpen(false)}
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          My Account
        </Link>

        {user.isAdmin && (
          <Link
            to="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Admin Dashboard
          </Link>
        )}

        <button
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
          className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    ) : (
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <button
          className="w-full flex items-center justify-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-2"
          onClick={() => {
            setIsOpen(false);
            setShowLogin(true);
          }}
        >
          <FaUser className="mr-2" />
          Account Login
        </button>
        <button
          className="w-full flex items-center justify-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-2"
          onClick={() => {
            setIsOpen(false);
            setShowAdminLogin(true);
          }}
        >
          <FaUser className="mr-2" />
          Admin Login
        </button>
      </div>
    )}
  </div>
)}

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Suwasthi Logo" className="h-24" />
          </Link>

          {/* Search Bar */}
          <div className="flex items-center w-1/2 bg-[#69974a] rounded-full px-4 py-3 relative">
            <BsSearch className="text-white text-lg mr-2" />
            <input
              type="text"
              placeholder="Search for..."
              className="bg-transparent w-full focus:outline-none text-white placeholder-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white text-black shadow-lg border rounded-md mt-2 z-10">
                {suggestions.map((product) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(product.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Account & Cart */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className='flex items-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-3'>
                  <FaUser className="mr-2" />
                  {user?.name?.split(' ')[0] || 'User'}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 trasti hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
                
              </div>
            ) : (
              <>
                <button
                  className='flex items-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-3'
                  onClick={() => setShowLogin(true)}
                >
                  <FaUser className="mr-2" />
                  Account
                </button>
                <button
                  className='flex items-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-3'
                  onClick={() => setShowAdminLogin(true)}
                >
                  <FaUser className="mr-2" />
                  Admin Login
                </button>
              </>
            )}

            <Link
              to="/cart"
              className="flex items-center bg-[#69974a] text-white font-semibold rounded-full px-6 py-3 gap-2"
            >
              <FaShoppingCart className="mr-2" />Cart ({cartCount})
              <span>${cartTotal.toFixed(2)}</span>
            </Link>
          </div>
        </div>

        {/* Search bar on mobile */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center w-full bg-[#69974a] rounded-full px-4 py-3">
            <BsSearch className="text-white text-lg mr-2" />
            <input
              type="text"
              placeholder="Search for..."
              className="bg-transparent w-full focus:outline-none text-white placeholder-white"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Bottom Category Links - Hidden on Mobile */}
      <div className="border-t bg-[#69974a] hidden md:flex">
        <div className="container mx-auto px-4 py-4 flex space-x-10 text-lg font-medium">
          <Link to="/">Home</Link>
          <Link to="/research">About Us & Our Research</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact Us</Link>
          {/* Only show Admin Page link if user is an admin */}
          {user && user.isAdmin && (
            <Link to="/admin/dashboard">Admin Page</Link>
          )}
        </div>
      </div>

      {/* Login Popup */}
      {showLogin && (
        <Loginpop
          currState={currState}
          setCurrState={setCurrState}
          setShowLogin={setShowLogin}
          setUser={setUser}
        />
      )}

      {/* Admin Login Popup */}
      {showAdminLogin && (
        <Loginpop
          currState="Login"
          setShowLogin={setShowAdminLogin}
          setUser={setUser}
          isAdminLogin={true}
        />
      )}
    </header>
  );
};

export default Header;