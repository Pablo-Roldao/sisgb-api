const mongoose = require("mongoose");

const archivedUserSchema = new mongoose.Schema(
    {
        name: String,
        cpf: String,
        birthDate: Date,
        addres: String,
        email: String,
        password: String,
        isFunctionary: Boolean,
        currentLoansQuantity: Number,
        deletionDate: Date
    },
    {
        versionKey: false
    }
);

const archivedUser = mongoose.model("Deleted user", archivedUserSchema);

module.exports = archivedUser;