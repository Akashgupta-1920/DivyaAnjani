// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaLeaf, FaCheck, FaUserMd } from 'react-icons/fa';

// Import product data from data.js
import { products } from '../assets/assets';

// Import carousel data from carouselData.js
import { carouselSlides } from '../assets/assets';

function Home({ searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [addedProducts, setAddedProducts] = useState([]);
  const navigate = useNavigate();

  const trustData = [
    {
      title: 'Authentic Ingredients',
      icon: <FaLeaf className="text-4xl text-green-500 mb-4" />,
      text: '100% natural and authentic Ayurvedic ingredients sourced directly from trusted suppliers.',
      number: '01',
    },
    {
      title: 'Expert Consultation',
      icon: <FaUserMd className="text-4xl text-green-500 mb-4" />,
      text: 'Formulated by Ayurvedic practitioners with decades of expertise.',
      number: '02',
    },
    {
      title: 'Quality Assured',
      icon: <FaCheck className="text-4xl text-green-500 mb-4" />,
      text: 'Each product undergoes rigorous quality testing.',
      number: '03',
    },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' ||
      product.category.split(',').some(cat => cat.trim().toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const suggestions = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    if (!addedProducts.includes(product.id)) {
      setAddedProducts((prev) => [...prev, product.id]);
      toast.success('Product Added Successfully!');
      navigate('/products');
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Carousel */}
      <Slider {...carouselSettings}>
        {carouselSlides.map((slide, i) => (
          <div key={i}>
            <div className="relative w-full">
              <img src={slide.image} alt={slide.title} className="w-full object-cover max-h-[700px]" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg md:text-xl">{slide.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Search */}
      <section className="max-w-[80rem] mx-auto px-4 py-16">
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-md"
          />
          {searchQuery && (
            <ul className="absolute bg-white w-[24%] border mt-1 rounded shadow z-10">
              {suggestions.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSearchQuery(p.name)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </div>


        <h2 className="text-3xl font-bold mb-10 text-center">Our Best Selling Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
               <div className="relative h-72 w-full">
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full hover:scale-105 transition-transform" />
                  </div>
                  <Link to={`/product/${product.id}`}>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedProducts.includes(product.id)}
                    className={`w-full mt-4 py-2 rounded ${
                      addedProducts.includes(product.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-secondary text-white hover:bg-secondary-dark'
                    }`}
                  >
                    {addedProducts.includes(product.id) ? 'Go to Products' : 'Add to Cart'}
                  </button>
                </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 px-auto sm:px-6 bg-gray-100">
<div className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto text-center">
  <h2 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-12">Why People Trust Us</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
    {trustData.map((item, index) => (
      <div key={index} className="card overflow-hidden rounded-2xl shadow-md">
        <div className="face face1 bg-white">
          <div className="content flex flex-col justify-center items-center gap-3 px-4 py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl">{item.icon}</div>
            <h2 className="text-lg sm:text-xl font-semibold">{item.title}</h2>
            <p className="text-sm sm:text-base text-gray-600">{item.text}</p>
          </div>
        </div>
        <div className="face face2 bg-green-500 text-white flex items-center justify-center py-6">
          <h2 className="text-2xl sm:text-4xl font-bold">{item.number}</h2>
        </div>
      </div>
    ))}
  </div>
</div>
</section> 
    </div>
  );
}

export default Home;


