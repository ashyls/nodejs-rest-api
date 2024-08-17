const bcrypt = require('bcrypt');
const userModel = require('./userModel');
const { validationResult } = require('express-validator');
const apiResponse = require('../apiResponse');

exports.signup = async (req, res) => {
    try {
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
};

exports.login = async (req, res) => {
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
};
