const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    isbn: String,
    title: String,
    authors: [String],
    numberOfPages: Number,
    publisher: String,
    publishDate: Date,
    edition: String,
    genre: String,
    description: String,
    state: String
})

const book = mongoose.model("Book", bookSchema);

module.exports = book;