const mongoose = require("mongoose");

const currentUserSchema = new mongoose.Schema(
    {
        cpf: String,
        password: String,
        refreshToken: String
    },
    {
        versionKey: false
    }
);

const currentUser = mongoose.model("Current user", currentUserSchema);

module.exports = currentUser;