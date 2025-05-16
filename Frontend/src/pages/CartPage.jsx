import { useCart } from './CartContext';
import { FaPlus, FaMinus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();
  const navigate = useNavigate();

  const handleIncrement = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="mt-16 md:mt-24 mx-auto px-2 sm:px-4 max-w-7xl">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="md:hidden flex items-center text-[#69974a] mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Cart Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 gap-4 items-center py-4 border-b">
          <div className="col-span-5 font-semibold text-gray-600">Product</div>
          <div className="col-span-2 font-semibold text-gray-600 text-center">Price</div>
          <div className="col-span-2 font-semibold text-gray-600 text-center">Quantity</div>
          <div className="col-span-2 font-semibold text-gray-600 text-center">Total</div>
          <div className="col-span-1 font-semibold text-gray-600 text-center">Action</div>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="px-6 py-2 bg-[#69974a] text-white rounded-md hover:bg-[#659a42] transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 sm:py-6 border-b">
                {/* Product Info - Full width on mobile */}
                <div className="col-span-1 sm:col-span-5 flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {/* Mobile-only price */}
                    <p className="sm:hidden text-gray-700 mt-1">
                      ${item.price.toFixed(2)} × {item.quantity} = <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                {/* Price - Hidden on mobile */}
                <div className="hidden sm:block col-span-2 text-center text-gray-700">
                  ${item.price.toFixed(2)}
                </div>

                {/* Quantity Controls */}
                <div className="col-span-1 sm:col-span-2 flex items-center justify-center space-x-3">
                  <button
                    onClick={() => handleDecrement(item)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full border border-gray-300"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Total - Hidden on mobile */}
                <div className="hidden sm:block col-span-2 text-center font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                  >
                    <FaTrash size={14} />
                    <span className="ml-2 sm:hidden">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Promo Code - Full width on mobile, 2 cols on desktop */}
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 sm:mb-4">Promo Code</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4">Enter your promo code if you have one</p>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-grow px-4 py-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-[#69974a]"
                    />
                    <button className="px-4 sm:px-6 py-2 bg-black text-white rounded-r hover:bg-gray-800">
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Totals - Full width on mobile, 1 col on desktop */}
              <div className="order-1 md:order-2">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 sm:mb-4">Cart Totals</h3>

                  <div className="space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>$2.00</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(cartTotal + 2).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/order')}
                    className="w-full py-3 bg-[#69974a] text-white rounded-md hover:bg-[#58853a] transition-colors"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping - Mobile only */}
                  <Link
                    to="/products"
                    className="mt-3 md:hidden block text-center px-4 py-2 border border-[#69974a] text-[#69974a] rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;