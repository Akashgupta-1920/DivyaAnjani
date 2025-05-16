import React, { useState } from 'react';
import { products as productList } from '../assets/assets'; // Update with actual path
import { FaStar } from 'react-icons/fa';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

function Products({ searchQuery = '', setSearchQuery }) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [buttonStatus, setButtonStatus] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = [
    'All Products',
    'Protein Products',
    'Weight Management',
    'Skin Care',
    'Health Care',
  ];

  const filteredProducts = productList.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' ||
      product.category.split(',').some(cat =>
        cat.trim().toLowerCase() === selectedCategory.toLowerCase()
      );

    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSearchFocus = () => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    }
  };

  const suggestions = productList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    setButtonStatus(prev => ({ ...prev, [product.id]: 'Added to Cart' }));
    setTimeout(() => {
      setButtonStatus(prev => ({ ...prev, [product.id]: 'Add to Cart' }));
    }, 2000);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Our Products</h1>

        {/* Search Bar with Suggestions */}
        <div className="relative max-w-md mx-auto mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Search products..."
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white shadow-lg border rounded-md mt-1 max-h-60 overflow-auto">
              {suggestions.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
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

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchQuery('');
              }}
              className={`px-4 py-2 rounded-full text-sm sm:text-base sm:px-6 transition-colors ${
                selectedCategory === category
                  ? 'bg-secondary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative h-72 w-full">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.category.split(',')[0]}</p>
                  </div>
                </Link>
                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'} size={18} />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(product)} className="w-full bg-secondary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
                    {buttonStatus[product.id] || 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;