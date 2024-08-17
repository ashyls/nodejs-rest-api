const productController = require('./productController');
const { productValidator } = require('./productValidation');
const express = require('express');


const router = express.Router();

router.post('/product', productValidator, productController.createProduct); // Create
router.get('/product/:id', productController.readProduct); // Read
router.put('/product/:id', productValidator, productController.updateProduct); // Update 
router.delete('/product/:id', productController.deleteProduct); // Delete

module.exports = router;