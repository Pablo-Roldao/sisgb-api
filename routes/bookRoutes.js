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
    const { ISBN, title, authors, numberOfPages, publisher, publishDate, genre, description } = req.body;

    state = "FREE";

    if (!ISBN || !title || !authors || !numberOfPages, !publisher || !publishDate || !genre || !description) {
        return res.status(422).json(
            {
                "message": "The book must contains ISBN, titles, authors, number of pages, publisher, publish date, genre and description!"
            }
        );
    }

    /*const bookExists = await Book.find({ "ISBN": ISBN });
    if (bookExists) {
        res.status(422).json(
            {
                "message": "A book with this ISBN has already been registered."
            }
        );
        return;
    }*/

    const book = new Book({
        ISBN,
        title,
        authors,
        numberOfPages,
        publisher,
        publishDate,
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
        const book = await Book.findOne({ "ISBN": isbn });
        if (!book) {
            return res.status(422).json({ "message": "Book not found!" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.post("/update/:isbn", async (req, res) => {
    const oldIsbn = req.params.isbn;
    const { ISBN, title, authors, numberOfPages, publisher, publishDate, genre, description, state } = req.body;

    if (!ISBN || !title || !authors || !numberOfPages, !publisher || !publishDate || !genre || !description || !state) {
        return res.status(422).json(
            {
                "message": "To update, te request must contains ISBN, titles, authors, number of pages, publisher, publish date, genre, description and state!"
            }
        );
    }

    const bookExists = await Book.find({ "ISBN": oldIsbn });
    if (!bookExists) {
        return res.status(422).json(
            {
                "message": "The book with this ISBN was not found!"
            }
        )
    }
    const newBook = new Book({
        _id: bookExists[0]._id,
        ISBN,
        title,
        authors,
        numberOfPages,
        publisher,
        publishDate,
        genre,
        description,
        state
    });

    try {
        await Book.replaceOne(
            {
                "ISBN": oldIsbn
            },
            newBook
        );
        res.status(201).json({ "message": "Book updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.delete("/delete/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const bookExists = await Book.find({ "ISBN": isbn });
    if (!bookExists) {
        return res.status(422).json(
            {
                "message": "The book with this ISBN was not found!"
            }
        )
    }

    try {
        await Book.deleteOne({ "ISBN": isbn});
        res.status(200).json({"message": "Book deleted successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.get("/get-all", async (req, res) => {
    try {
        const books = await Book.find();
        if (!books) {
            return res.status(422).json({ "message": "No book registered!" });
        }
        res.status(200).json(books);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

module.exports = router;