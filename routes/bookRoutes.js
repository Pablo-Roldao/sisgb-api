const express = require("express");
const router = require("express").Router();
const Book = require("../models/Book");

router.use(
    express.urlencoded({
        extended: true
    })
);
router.use(express.json());

router.post("/register", async (req, res) => {
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description } = req.body;

    const state = "free";

    if (!isbn) {
        return res.status(422).json({ "message": "The book must contains an ISBN!" });
    }
    if (!title) {
        return res.status(422).json({ "message": "The book must contains a title!" });
    }
    if (!authors) {
        return res.status(422).json({ "message": "The book must contains the authors!" });
    }
    if (!numberOfPages) {
        return res.status(422).json({ "message": "The book must contains a number of pages!" });
    }
    if (!publisher) {
        return res.status(422).json({ "message": "The book must contains a publisher!" });
    }
    if (!publishDate) {
        return res.status(422).json({ "message": "The book must contains a publish date!" });
    }
    if (!edition) {
        return res.status(422).json({ "message": "The book must contains an edition!" });
    }
    if (!genre) {
        return res.status(422).json({ "message": "The book must contains a genre!" });
    }
    if (!description) {
        return res.status(422).json({ "message": "The book must contains a description!" });
    }

    const bookInBD = await Book.findOne({ "isbn": isbn });
    if (bookInBD) {
        return res.status(422).json(
            {
                "message": "A book with this ISBN has already been registered."
            }
        );
    }

    const book = new Book({
        isbn,
        title,
        authors,
        numberOfPages,
        publisher,
        publishDate,
        edition,
        genre,
        description,
        state
    });

    try {
        await Book.create(book);
        res.status(201).json({ "message": "Book registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.get("/get-by-isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await Book.findOne({ "isbn": isbn });
        if (!book) {
            return res.status(422).json({ "message": "Book not found!" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const books = await Book.find();
        if (!books[0]) {
            return res.status(422).json({ "message": "No books registered!" });
        }
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.post("/update/:isbn", async (req, res) => {
    const oldIsbn = req.params.isbn;
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description, state } = req.body;

    if (!isbn) {
        return res.status(422).json({ "message": "The book must contains an ISBN!" });
    }
    if (!title) {
        return res.status(422).json({ "message": "The book must contains a title!" });
    }
    if (!authors) {
        return res.status(422).json({ "message": "The book must contains the authors!" });
    }
    if (!numberOfPages) {
        return res.status(422).json({ "message": "The book must contains a number of pages!" });
    }
    if (!publisher) {
        return res.status(422).json({ "message": "The book must contains a publisher!" });
    }
    if (!publishDate) {
        return res.status(422).json({ "message": "The book must contains a publish date!" });
    }
    if (!edition) {
        return res.status(422).json({ "message": "The book must contains an edition!" });
    }
    if (!genre) {
        return res.status(422).json({ "message": "The book must contains a genre!" });
    }
    if (!description) {
        return res.status(422).json({ "message": "The book must contains a description!" });
    }
    if (!state) {
        return res.status(422).json({ "message": "The book must contains as state!" });
    }

    const bookInBD = await Book.findOne({ "isbn": oldIsbn });
    if (!bookInBD) {
        return res.status(422).json(
            {
                "message": "The book with this ISBN was not found!"
            }
        )
    }

    const newBook = new Book({
        _id: bookInBD._id,
        isbn,
        title,
        authors,
        numberOfPages,
        publisher,
        publishDate,
        edition,
        genre,
        description,
        state
    });

    try {
        await Book.replaceOne({ "isbn": oldIsbn }, newBook);
        res.status(201).json({ "message": "Book updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.delete("/delete/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const bookInBD = await Book.findOne({ "isbn": isbn });
    if (!bookInBD) {
        return res.status(422).json(
            {
                "message": "The book with this ISBN was not found!"
            }
        )
    }

    try {
        await Book.deleteOne({ "isbn": isbn });
        res.status(200).json({ "message": "Book deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

module.exports = router;