const Book = require("../model/Book");
const ArchivedBook = require("../model/ArchivedBook");
const Loan = require("../model/Loan");

const register = async (req, res) => {
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description, imgSrc } = req.body;

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
    if (!imgSrc) {
        return res.status(422).json({ "message": "The book must contains an image link!" });
    }

    const bookInBD = await Book.findOne({ "isbn": isbn });
    if (bookInBD) {
        return res.status(409).json(
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
        imgSrc,
        state
    });

    try {
        await Book.create(book);
        res.status(201).json({ "message": "Book registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const getByIsbn = async (req, res) => {
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
}

const getAll = async (req, res) => {
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
}

const updateByIsbn = async (req, res) => {
    const { isbn, title, authors, numberOfPages, publisher, publishDate, edition, genre, description, imgSrc, state } = req.body;

    if (!isbn) {
        return res.status(422).json({ "message": "The request must contains the old isbn!" });
    }
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
    if (!imgSrc) {
        return res.status(422).json({ "message": "The book must contains an image link!" });
    }
    if (!state) {
        return res.status(422).json({ "message": "The book must contains an state!" });
    }

    const bookInBD = await Book.findOne({ "isbn": isbn });
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
        imgSrc,
        state
    });

    try {
        await Book.replaceOne({ "isbn": isbn }, newBook);
        res.status(201).json({ "message": "Book updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const deleteByIsbn = async (req, res) => {
    const isbn = req.body.isbn;
    const bookInBD = await Book.findOne({ "isbn": isbn });
    if (!bookInBD) {
        return res.status(422).json({ "message": "The book with this ISBN was not found!" });
    }

    const loansInBd = await Loan.find({ "bookIsbn": isbn });
    if (loansInBd[0]) {
        return res.status(500).json({ "message": "The book has an open loan!" });
    }

    const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const bookForArchive = new ArchivedBook({
        isbn: bookInBD.isbn,
        title: bookInBD.title,
        authors: bookInBD.authors,
        numberOfPages: bookInBD.numberOfPages,
        publisher: bookInBD.publisher,
        publishDate: bookInBD.publishDate,
        edition: bookInBD.edition,
        genre: bookInBD.genre,
        description: bookInBD.description,
        imgSrc: bookInBD.imgSrc,
        state: bookInBD.state,
        deletionDate: dateFormated
    });

    try {
        await Book.deleteOne({ "isbn": isbn });
        await ArchivedBook.create(bookForArchive);
        res.status(200).json({ "message": "Book deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

module.exports = {
    register,
    getByIsbn,
    getAll,
    updateByIsbn,
    deleteByIsbn
}