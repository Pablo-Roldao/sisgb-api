const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        isbn: String,
        title: String,
        authors: [String],
        numberOfPages: Number,
        publisher: String,
        publishDate: Date,
        edition: String,
        genre: [String],
        description: String,
        imgSrc: String,
        state: String
    },
    {
        versionKey: false
    }
);

const book = mongoose.model("Book", bookSchema);

module.exports = book;