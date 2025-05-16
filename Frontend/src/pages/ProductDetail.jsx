import { useParams } from "react-router-dom";
import { products } from "../assets/assets";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "./CartContext"; // Assuming you have a CartContext

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [buttonStatus, setButtonStatus] = useState("");

  const product = products.find((p) => p.id.toString() === productId);
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  // Find related products (same category, different ID)
  const relatedProducts = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category.split(",").some((cat) =>
        product.category.toLowerCase().includes(cat.trim().toLowerCase())
      )
  );

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });

    setButtonStatus('Added to Cart');
    setTimeout(() => {
      setButtonStatus('Add to Cart');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img src={product.image} alt={product.name} className="w-full max-h-[500px] object-contain" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.category}</p>
          <p className="text-lg text-green-600 font-semibold mb-2">₹{product.price.toFixed(2)}</p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"} />
            ))}
          </div>
          <div className="flex flex-col m-auto gap-4">
                  <button
            onClick={handleAddToCart}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded mb-4"
          >
            {buttonStatus || 'Add to Cart'}
          </button>

          <button
            onClick={() => navigate("/products")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
          >
            Go to All Products
          </button>    
          </div>

        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-60 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="mt-1 text-green-600 font-semibold">₹{p.price.toFixed(2)}</p>
                <button
                  className="mt-3 w-full bg-green-500 text-white py-1 rounded"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
