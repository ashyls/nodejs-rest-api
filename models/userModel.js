const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userid: String,
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String
});

module.exports = new mongoose.model('Users', userSchema)