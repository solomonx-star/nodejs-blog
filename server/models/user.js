const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create the model class for users with a schema
const UserSchema = {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true}
};

const user = mongoose.model('User', UserSchema)
module.exports = user;