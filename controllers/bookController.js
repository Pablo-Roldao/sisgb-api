const Book = require("../model/Book");
const Loan = require("../model/Loan");

const register = async (req, res) => {
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description, imgSrc } = req.body;

    const state = "free";

    if (!isbn) { return res.status(422).json({ "error": "The book must contains an ISBN!" }); }
    if (!title) { return res.status(422).json({ "error": "The book must contains a title!" }); }
    if (!authors) { return res.status(422).json({ "error": "The book must contains the authors!" }); }
    if (!numberOfPages) { return res.status(422).json({ "error": "The book must contains a number of pages!" }); }
    if (!publisher) { return res.status(422).json({ "error": "The book must contains a publisher!" }); }
    if (!publishDate) { return res.status(422).json({ "error": "The book must contains a publish date!" }); }
    if (!edition) { return res.status(422).json({ "error": "The book must contains an edition!" }); }
    if (!genre) { return res.status(422).json({ "error": "The book must contains a genre!" }); }
    if (!description) { return res.status(422).json({ "error": "The book must contains a description!" }); }
    if (!imgSrc) { return res.status(422).json({ "error": "The book must contains an image link!" }); }

    const foundBook = await Book.findOne({ "isbn": isbn });
    if (foundBook) {
        return res.status(409).json({ "error": "A book with this ISBN has already been registered." });
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
        imgSrc,
        state
    });

    try {
        await Book.create(book);
        res.status(201).json({ "success": "Book registered successfully!" })
    } catch (err) {
        res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getAll = async (req, res) => {
    try {
        const books = await Book.find();
        /*if (!books[0]) {
            return res.status(404).json({ "error": "No books registered!" });
        }*/
        res.status(200).json(books);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getByIsbn = async (req, res) => {
    const isbn = req.body.isbn;
    if (!isbn) { return res.status(422).json({ "error": "The request must contains the book's id!" }); }
    try {
        const book = await Book.findOne({ "isbn": isbn });
        if (!book) {
            return res.status(404).json({ "error": "Book not found!" });
        }
        res.status(200).json(book);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const update = async (req, res) => {
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description, imgSrc, state } = req.body;

    if (!isbn) { return res.status(422).json({ "error": "The book must contains an ISBN!" }); }
    if (!title) { return res.status(422).json({ "error": "The book must contains a title!" }); }
    if (!authors) { return res.status(422).json({ "error": "The book must contains the authors!" }); }
    if (!numberOfPages) { return res.status(422).json({ "error": "The book must contains a number of pages!" }); }
    if (!publisher) { return res.status(422).json({ "error": "The book must contains a publisher!" }); }
    if (!publishDate) { return res.status(422).json({ "error": "The book must contains a publish date!" }); }
    if (!edition) { return res.status(422).json({ "error": "The book must contains an edition!" }); }
    if (!genre) { return res.status(422).json({ "error": "The book must contains a genre!" }); }
    if (!description) { return res.status(422).json({ "error": "The book must contains a description!" }); }
    if (!imgSrc) { return res.status(422).json({ "error": "The book must contains an image link!" }); }
    if (!state) { return res.status(422).json({ "error": "The book must contains an state!" }); }

    const foundBook = await Book.findOne({ "isbn": isbn });
    if (!foundBook) {
        return res.status(404).json({ "error": "The book with this ISBN was not found!" })
    }

    const book = new Book({
        _id: foundBook._id,
        isbn,
        title,
        authors,
        numberOfPages,
        publisher,
        publishDate,
        edition,
        genre,
        description,
        imgSrc,
        state
    });

    console.log(book);

    try {
        await Book.replaceOne({ "isbn": isbn }, book);
        res.status(201).json({ "success": "Book updated successfully!" })
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const deleteByIsbn = async (req, res) => {
    const isbn = req.body.isbn;

    console.log(isbn);

    const foundBook = await Book.findOne({ "isbn": isbn });
    if (!foundBook) {
        return res.status(404).json({ "error": "The book with this ISBN was not found!" });
    }

    const foundLoans = await Loan.find({ "bookIsbn": isbn });
    if (foundLoans[0]) {
        return res.status(409).json({ "error": "The book has an open loan!" });
    }

    /*const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;*/

    try {
        await Book.deleteOne({ "isbn": isbn });
        res.status(200).json({ "success": "Book deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

module.exports = {
    register,
    getAll,
    getByIsbn,
    update,
    deleteByIsbn
}