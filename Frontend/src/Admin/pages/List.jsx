import React, { useEffect, useState } from 'react';
import axios from 'axios';

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5011/api/products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <button 
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(prod => (
            <div key={prod._id} className="bg-white border rounded shadow p-4">
              <img
                src={`http://localhost:5011/uploads/${prod.image}`}
                alt={prod.name}
                className="h-40 w-full object-cover rounded mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path_to_default_image';
                }}
              />
              <h2 className="text-lg font-semibold">{prod.name}</h2>
              <p className="text-gray-600">{prod.category}</p>
              <p className="mt-1 text-sm text-gray-500">{prod.description}</p>
              <p className="mt-2 font-bold">${prod.price}</p>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            No products found. Add some products to see them here.
          </div>
        )}
      </div>
    </div>
  );
};

export default List;