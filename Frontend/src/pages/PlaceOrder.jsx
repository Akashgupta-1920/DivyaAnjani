import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-between">
        {/* Delivery Information */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Delivery Information
          </h2>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  placeholder="John" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="@gamil.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                type="text" 
                placeholder="123 Main St" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text" 
                  placeholder="Delhi" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input 
                  type="text" 
                  placeholder="Punjab" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                <input 
                  type="text" 
                  placeholder="10001" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  type="text" 
                  placeholder="India" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 " 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#69974a] focus:border-[#69974a] transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({cartCount} items)</span>
              <span className="font-medium">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$2.00</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">${(cartTotal + 2).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/payment')}
            className="w-full py-4 bg-[#69974a] text-white rounded-lg font-bold hover:bg-[#58853a] transition-colors shadow-md"
          >
            Place Order
          </button>

          <div className="mt-4 text-sm text-gray-500">
            <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;