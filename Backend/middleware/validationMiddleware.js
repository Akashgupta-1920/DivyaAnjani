// Validation middleware for product router
const validateProductInput = (req, res, next) => {
  const { name, description, category, price, stock } = req.body;
  const errors = [];

  // Required fields validation
  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  } else if (name.length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }

  if (!description || description.trim() === '') {
    errors.push('Product description is required');
  } else if (description.length > 1000) {
    errors.push('Product description cannot exceed 1000 characters');
  }

  if (!category || category.trim() === '') {
    errors.push('Product category is required');
  }

  // Price validation
  if (!price) {
    errors.push('Product price is required');
  } else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
    errors.push('Product price must be a positive number');
  }

  // Stock validation (if provided)
  if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
    errors.push('Product stock must be a non-negative integer');
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Continue to next middleware
  next();
};

// Validation middleware for product update (less strict than create)
const validateUpdateProductInput = (req, res, next) => {
  const { name, description, category, price, stock } = req.body;
  const errors = [];

  // Optional fields validation (only validate if provided)
  if (name !== undefined && name.trim() === '') {
    errors.push('Product name cannot be empty');
  } else if (name && name.length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }

  if (description !== undefined && description.trim() === '') {
    errors.push('Product description cannot be empty');
  } else if (description && description.length > 1000) {
    errors.push('Product description cannot exceed 1000 characters');
  }

  if (category !== undefined && category.trim() === '') {
    errors.push('Product category cannot be empty');
  }

  // Price validation (if provided)
  if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
    errors.push('Product price must be a positive number');
  }

  // Stock validation (if provided)
  if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
    errors.push('Product stock must be a non-negative integer');
  }

  // Return errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
      code: 'VALIDATION_ERROR'
    });
  }

  // Continue to next middleware
  next();
};

module.exports = {
  validateProductInput,
  validateUpdateProductInput
};