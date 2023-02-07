const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
    {
        userCpf: String,
        bookIsbn: String,
        startDate: Date,
        finishDate: Date
    },
    {
        versionKey: false
    }
);

const loan = mongoose.model("Loan", loanSchema);

module.exports = loan;