const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        cpf: String,
        birthDate: Date,
        addres: String,
        email: String,
        password: String,
        isFunctionary: Boolean,
        currentReservationsLoansQuantity: Number
    },
    {
        versionKey: false
    }
);

const user = mongoose.model("User", userSchema);

module.exports = user;