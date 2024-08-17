const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { body, validationResult } = require('express-validator');
const apiResponse = require('../tools/apiResponse');

exports.signup = [
    // Validate fields
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

    // Process request after validation and sanitization
    async (req, res) => {
        try {
            // Extract the validation errors from a request.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else { 
                // Hash password
                const hash = await bcrypt.hash(req.body.password, 10);

                // Create a new user
                let user = new userModel({
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                });

                // Save the user to the database
                await user.save();

                let userData = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };

                return apiResponse.successResponseWithData(res, "Registration Success.", userData);
            }
        } catch (err) {
            return apiResponse.errorResponse(res, err);
        }
    }
];

exports.login = [
    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
        .isEmail().withMessage("Email must be a valid email address."),
    body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                const user = await userModel.findOne({ email: req.body.email });
                if (user) {
                    const isMatch = await bcrypt.compare(req.body.password, user.password);
                    if (isMatch) {
                        const userData = {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        };
                        return apiResponse.successResponseWithData(res, 'Login Success', userData);
                    } else {
                        return apiResponse.unauthorizedResponse(res, "Email or Password is incorrect.");
                    }
                } else {
                    return apiResponse.unauthorizedResponse(res, "Account not found. Please sign up before attempting to log in.");
                }
            }
        } catch (error) {
            return apiResponse.errorResponse(res, error);
        }
    }
];
