const Products = require('./porductModel');
const { body, validationResult } = require('express-validator');
const apiResponse = require('../apiResponse');

// Create Product
exports.createProduct = [
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
      }
  
      const product = new Products({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      });
  
      try {
        const savedProduct = await product.save();
        return apiResponse.successResponseWithData(res, 'Product created successfully.', savedProduct);
      } catch (err) {
        return apiResponse.errorResponse(res, err);
      }
    }
];

// Read Product
exports.readProduct = async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (product === null) {
        return apiResponse.notFoundResponse(res, 'Product not found.');
      }
      return apiResponse.successResponseWithData(res, 'Product retrieved successfully.', product);
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
};

// Update Product
exports.updateProduct = [
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, 'Validation Error.', errors.array());
      }
  
      const product = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      };
  
      try {
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, product, { new: true });
        if (updatedProduct === null) {
          return apiResponse.notFoundResponse(res, 'Product not found.');
        }
        return apiResponse.successResponseWithData(res, 'Product updated successfully.', updatedProduct);
      } catch (err) {
        return apiResponse.errorResponse(res, err);
      }
    }
];

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) {
      return apiResponse.notFoundResponse(res, 'Product not found.');
    }
    return apiResponse.successResponse(res, 'Product deleted successfully.');
  } catch (err) {
    return apiResponse.errorResponse(res, err);
  }
};