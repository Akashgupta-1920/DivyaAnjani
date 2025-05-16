const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');
const { authenticateToken, admin } = require('../middleware/authenticateToken');
const { validateProductInput, validateUpdateProductInput } = require('../middleware/validationMiddleware');

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_LIMIT = 100;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Configure multer with improved security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { 
    fileSize: MAX_FILE_SIZE,
    files: 1 
  }
});

// Improved error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    let status = 400;
    let message = err.message;
    let code = 'UPLOAD_ERROR';

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
        code = 'FILE_TOO_LARGE';
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Only one file is allowed.';
        code = 'TOO_MANY_FILES';
      }
    }

    return res.status(status).json({
      success: false,
      message,
      code
    });
  }
  next();
};

// Helper function to safely delete files
const safeDeleteFile = (filePath) => {
  if (!filePath) return;
  
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
};

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post(
  '/',
  authenticateToken,
  admin,
  upload.single('image'),
  handleMulterError,
  validateProductInput,
  async (req, res) => {
    try {
      const { name, description, category, price, stock } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Product image is required',
          code: 'MISSING_IMAGE'
        });
      }

      const imageUrl = path.posix.join('/uploads/products', path.basename(req.file.path));

      const product = new Product({
        name,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        imageUrl,
        // createdBy: req.user.userId
      });

      await product.save();

      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      if (req.file) {
        safeDeleteFile(req.file.path);
      }

      res.status(400).json({
        success: false,
        message: error.message,
        code: 'PRODUCT_CREATION_FAILED'
      });
    }
  }
);

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, limit = 10, page = 1 } = req.query;
    
    // Build filter
    const filter = {};
    
    if (category) filter.category = { $in: category.split(',') };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Build sort
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }
    
    // Pagination
    const limitNum = Math.min(parseInt(limit), MAX_LIMIT);
    const pageNum = Math.max(parseInt(page), 1);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
        code: 'INVALID_ID'
      });
    }

    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Fully update a product
// @access  Private/Admin
router.put(
  '/:id',
  // authenticateToken,
  // admin,
  upload.single('image'),
  handleMulterError,
  // validateProductInput,
  async (req, res) => {
    try {
      // Validate ID format
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        if (req.file) safeDeleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
          code: 'INVALID_ID'
        });
      }

      const { name, description, category, price, stock } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        if (req.file) safeDeleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        });
      }

      // Prepare update data
      const updateData = {
        name,
        description,
        category,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        updatedBy: req.user.userId
      };

      // Handle image update
      if (req.file) {
        safeDeleteFile(product.imageUrl);
        updateData.imageUrl = path.posix.join('/uploads/products', path.basename(req.file.path));
      }

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    } catch (error) {
      if (req.file) safeDeleteFile(req.file.path);

      res.status(400).json({
        success: false,
        message: error.message,
        code: 'PRODUCT_UPDATE_FAILED'
      });
    }
  }
);

// @route   PATCH /api/products/:id
// @desc    Partially update a product
// @access  Private/Admin
router.patch(
  '/:id',
  authenticateToken,
  admin,
  upload.single('image'),
  handleMulterError,
  validateUpdateProductInput,
  async (req, res) => {
    try {
      // Validate ID format
      if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        if (req.file) safeDeleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
          code: 'INVALID_ID'
        });
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        if (req.file) safeDeleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        });
      }

      // Prepare update data from provided fields only
      const updateData = { updatedBy: req.user.userId };
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.category) updateData.category = req.body.category;
      if (req.body.price) updateData.price = parseFloat(req.body.price);
      if (req.body.stock) updateData.stock = parseInt(req.body.stock);

      // Handle image update
      if (req.file) {
        safeDeleteFile(product.imageUrl);
        updateData.imageUrl = path.posix.join('/uploads/products', path.basename(req.file.path));
      }

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    } catch (error) {
      if (req.file) safeDeleteFile(req.file.path);

      res.status(400).json({
        success: false,
        message: error.message,
        code: 'PRODUCT_UPDATE_FAILED'
      });
    }
  }
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', authenticateToken, admin, async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
        code: 'INVALID_ID'
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Delete associated image
    safeDeleteFile(product.imageUrl);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product',
      code: 'SERVER_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;