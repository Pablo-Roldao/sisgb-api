const Loan = require("../model/Loan");
const User = require("../model/User");
const Book = require("../model/Book");

const getActualDate = () => {
    return (new Date().toISOString().split('T')[0]);
}

const register = async (req, res) => {
    const { userCpf, bookIsbn, finishDate } = req.body;

    if (!userCpf) { return res.status(422).json({ "error": "The loan must contains a CPF of an user!" }); }
    if (!bookIsbn) { return res.status(422).json({ "error": "The loan must contains an ISBN of a book!" }); }
    if (!finishDate) { return res.status(422).json({ "error": "The loan must contains a finish date!" }); }


    const foundUser = await User.findOne({ "cpf": userCpf });
    if (!foundUser) {
        return res.status(404).json({ "error": "User not found!" });
    }

    const foundBook = await Book.findOne({ "isbn": bookIsbn });
    if (!foundBook) {
        return res.status(404).json({ "error": "Book not found!" });
    }

    if (foundBook.state === "loaned") {
        return res.status(409).json({ "error": "Book already loaned!" });
    }
    if (foundBook.state === "reserved") {
        return res.status(409).json({ "error": "Book reserved!" });
    }

    if (foundUser.currentReservationsLoansQuantity === 3) {
        return res.status(423).json({ "error": "Current loans/reservations quantity fully!" });
    }

    const loan = new Loan({
        userCpf,
        bookIsbn,
        startDate: getActualDate(),
        finishDate
    });

    try {
        await Loan.create(loan);

        foundBook.state = "loaned";
        await Book.replaceOne({ "isbn": foundBook.isbn }, foundBook);

        foundUser.currentReservationsLoansQuantity++;
        await User.replaceOne({ "cpf": foundUser.cpf }, foundUser);

        res.status(201).json({ "success": "Loan registered successfully!" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getAll = async (req, res) => {
    try {
        const loans = await Loan.find();
        if (!loans[0]) {
            return res.status(404).json({ "error": "No loans registered!" });
        }
        res.status(200).json(loans);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getById = async (req, res) => {
    const id = req.body.id;
    if (!id) { res.status(422).json({ "error": "The request must contains the loan's id!" }) }
    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ "error": "Loan not found!" });
        }
        res.status(200).json(loan);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const update = async (req, res) => {
    const { id, finishDate } = req.body;

    if (!id) { return res.status(422).json({ "error": "The request must contains the loan's id!" }); }
    if (!finishDate) { return res.status(422).json({ "error": "The loan must contains a finish date!" }); }

    const foundLoan = await Loan.findById(id);
    if (!foundLoan) {
        return res.status(404).json({ "error": "The loan with this id was not found!" });
    }

    const loan = new Loan({
        userCpf: foundLoan.userCpf,
        bookIsbn: foundLoan.bookIsbn,
        startDate: getActualDate,
        finishDate
    });

    try {
        await Loan.replaceOne({ "_id": id }, loan);
        res.status(201).json({ "success": "Loan updated successfully!" })
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const deleteById = async (req, res) => {
    const id = req.body.id;
    if (!id) { return res.status(422).json({ "error": "The request must contains the loan's id!" }); }

    const foundLoan = await Loan.findById(id);
    if (!foundLoan) {
        return res.status(404).json({ "error": "The loan with this id was not found!" });
    }

    const foundBook = await Book.findOne({ "isbn": foundLoan.bookIsbn });

    const foundUser = await User.findOne({ "cpf": foundLoan.userCpf });

    /*const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;*/

    try {
        await Loan.deleteOne({ "_id": id });

        foundBook.state = "free";
        await Book.replaceOne({ "isbn": foundBook.isbn }, foundBook);

        foundUser.currentReservationsLoansQuantity--;
        await User.replaceOne({ "cpf": foundUser.cpf }, foundUser);

        res.status(200).json({ "success": "Loan deleted successfully!" });
    } catch (err) {
        return res.status(500).json({"error": `Error: ${err}`});
    }
}

module.exports = {
    register,
    getAll,
    getById,
    update,
    deleteById
}