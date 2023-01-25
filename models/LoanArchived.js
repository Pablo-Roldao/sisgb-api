const mongoose = require("mongoose");

const archivedLoanSchema = new mongoose.Schema(
    {
        userCpf: String,
        bookIsbn: String,
        startDate: Date,
        finishDate: Date,
        deletionDate: Date
    },
    {
        versionKey: false
    }
);

const archivedLoan = mongoose.model("Deleted loan", archivedLoanSchema);

module.exports = archivedLoan;