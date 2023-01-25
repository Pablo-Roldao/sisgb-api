const mongoose = require("mongoose");

const archivedBookSchema = new mongoose.Schema(
    {
        isbn: String,
        title: String,
        authors: [String],
        numberOfPages: Number,
        publisher: String,
        publishDate: Date,
        edition: String,
        genre: String,
        description: String,
        state: String,
        deletionDate: Date
    },
    {
        versionKey: false
    }
);

const archivedBook = mongoose.model("Deleted book", archivedBookSchema);

module.exports = archivedBook;
