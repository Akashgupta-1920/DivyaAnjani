
import React, { useState, useEffect } from 'react';
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

  // Revoke preview URL on unmount or image change
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload a product image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in as admin');
        return;
      }

      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('image', image);

      const response = await axios.post(
        "https://divyaanjani.onrender.com/api/products",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201 || response.data.success) {
        toast.success(response.data.message || 'Product added successfully!');
        setProduct({ name: '', description: '', category: 'Protein Products', price: '' });
        setImage(null);
      } else {
        toast.error(response.data.message || 'Error adding product');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error adding product';
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 text-gray-600">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Upload Image</p>
          <label htmlFor="image" className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden">
            <img
              src={previewUrl || assets.upload_area}
              alt={previewUrl ? 'Preview' : 'Upload'}
              className="object-cover w-full h-full"
            />
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Product Name</p>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Type here"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="font-medium">Product Description</p>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={6}
            placeholder="Write content here"
            required
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category & Price */}
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Category</p>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Protein Products</option>
              <option>Weight Management</option>
              <option>Skin Care</option>
              <option>Health Care</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Price ($)</p>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="20.00"
              required
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-32 py-3 rounded-lg text-white font-semibold bg-green-700 hover:bg-green-600 transition disabled:opacity-70"
        >
          {loading ? 'ADDING...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default Add;
