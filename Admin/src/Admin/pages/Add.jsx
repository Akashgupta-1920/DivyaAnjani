import React, { useState } from 'react';
import { assets } from '../../assets/admin/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'Protein Products',
    price: ''
  });

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmit called');

    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in as admin');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('image', image);

      const response = await axios.post(
        'http://localhost:5011/api/products',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Product added successfully!');

        // Reset form
        setProduct({
          name: '',
          description: '',
          category: 'Protein Products',
          price: ''
        });
        setImage(null);
      } else {
        toast.error(response.data.message || 'Error adding product');
      }

    } catch (error) {
      const message = error.response?.data?.message || 'Error adding product';
      toast.error(message);
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add'>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_area} 
              alt={image ? "Product preview" : "Upload area"} 
            />
          </label>
          <input 
            onChange={handleImageChange} 
            type="file" 
            accept="image/*"
            id='image' 
            hidden 
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input 
            type="text" 
            name="name" 
            value={product.name}
            onChange={handleChange}
            placeholder='Type Here' 
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            name="description" 
            value={product.description}
            onChange={handleChange}
            rows='6' 
            placeholder='Write content here' 
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select 
              name="category" 
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="Protein Products">Protein Products</option>
              <option value="Weight Management">Weight Management</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Health Care">Health Care</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              type="number" 
              name="price" 
              value={product.price}
              onChange={handleChange}
              placeholder='$20' 
              required
            />
          </div>
        </div>

        <button 
          type='submit' 
          className='add-btn flex-col'
          disabled={loading}
        >
          {loading ? 'ADDING...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default Add;
