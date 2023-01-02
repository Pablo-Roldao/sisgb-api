const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    cpf: String,
    birthDate: Date,
    email: String,
    password: String,
    isFunctionary: Boolean
});

const user = mongoose.model("User", userSchema);

module.exports = user;