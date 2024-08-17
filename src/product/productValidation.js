const { body } = require('express-validator');

exports.productValidator = [
    body('name').isLength({ min: 1 }).trim().withMessage('Name must be specified.'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
    body('description').optional({ checkFalsy: true }).trim(),
]