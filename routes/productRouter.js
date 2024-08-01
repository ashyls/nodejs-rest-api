const productController = require('../controller/productController');
const express = require('express');

const router = express.Router();

router.post('/product', productController.create_product);
router.get('/product/:id', productController.read_product);
router.put('/product/:id', productController.update_product);
router.delete('/product/:id', productController.delete_product);

module.exports = router;