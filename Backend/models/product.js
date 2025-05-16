const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Protein Products', 'Weight Management', 'Skin Care', 'Health Care']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;