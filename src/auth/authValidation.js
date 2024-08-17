const { body } = require('express-validator');
const userModel = require('./userModel');

exports.signupValidator = [
    body("firstname")
        .isLength({ min: 1 }).trim().withMessage("First name must be specified.")
        .isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
    body("lastname")
        .isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
        .isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
    body("email")
        .isLength({ min: 1 }).trim().withMessage("Email must be specified.")
        .isEmail().withMessage("Email must be a valid address.").custom((value) => {
            return userModel.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject("E-mail already in use.");
                }
            });
        }),
    body("password")
        .isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
];

exports.loginValidator = [
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
        .isEmail().withMessage("Email must be a valid email address."),
    body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
];
