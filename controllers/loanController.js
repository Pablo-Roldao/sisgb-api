const Loan = require("../model/Loan");
const ArchivedLoan = require("../model/ArchivedLoan");
const User = require("../model/User");
const Book = require("../model/Book");

const register = async (req, res) => {
    const { userCpf, bookIsbn, startDate, finishDate } = req.body;

    if (!userCpf) {
        return res.status(422).json({ "message": "The loan must contains a CPF of an user!" });
    }
    if (!bookIsbn) {
        return res.status(422).json({ "message": "The loan must contains an ISBN of a book!" });
    }
    if (!startDate) {
        return res.status(422).json({ "message": "The loan must contains an start date!" });
    }
    if (!finishDate) {
        return res.status(422).json({ "message": "The loan must contains a finish date!" });
    }

    const userInBD = await User.findOne({ "cpf": userCpf });
    if (!userInBD) {
        return res.status(422).json({ "message": "User not found!" });
    }

    const bookInBD = await Book.findOne({ "isbn": bookIsbn });
    if (!bookInBD) {
        return res.status(422).json({ "message": "Book not found!" });
    }

    if (bookInBD.state === "loaned") {
        return res.status(500).json({ "message": "Book already loaned!" });
    }
    if (bookInBD.state === "reserved") {
        return res.status(500).json({ "message": "Book reserved!" });
    }

    if (userInBD.currentReservationsLoansQuantity === 3) {
        return res.status(500).json({ "message": "Current loans/reservations quantity fully!" });
    }

    const loan = new Loan({
        userCpf,
        bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Loan.create(loan);

        bookInBD.state = "loaned";
        await Book.replaceOne({ "isbn": bookInBD.isbn }, bookInBD);

        userInBD.currentReservationsLoansQuantity = userInBD.currentReservationsLoansQuantity + 1;
        await User.replaceOne({ "cpf": userInBD.cpf }, userInBD);

        res.status(201).json({ "message": "Loan registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }

}

const getAll = async (req, res) => {
    try {
        const loans = await Loan.find();
        if (!loans[0]) {
            return res.status(422).json({ "message": "No loans registered!" });
        }
        res.status(200).json(loans);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(422).json({ "message": "Loan not found!" });
        }
        res.status(200).json(loan);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const updateById = async (req, res) => {
    const id = req.params.id;
    const { startDate, finishDate } = req.body;

    if (!startDate) {
        return res.status(422).json({ "message": "The loan must contains an start date!" });
    }
    if (!finishDate) {
        return res.status(422).json({ "message": "The loan must contains a finish date!" });
    }

    const loanInBD = await Loan.findById(id);
    if (!loanInBD) {
        return res.status(422).json(
            {
                "message": "The loan with this id was not found!"
            }
        )
    }

    const newLoan = new Loan({
        _id: loanInBD._id,
        userCpf: loanInBD.userCpf,
        bookIsbn: loanInBD.bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Loan.replaceOne({ "_id": id }, newLoan);
        res.status(201).json({ "message": "Loan updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const deleteById = async (req, res) => {
    const id = req.body.id;
    const loanInBD = await Loan.findById(id);
    if (!loanInBD) {
        return res.status(422).json(
            {
                "message": "The loan with this id was not found!"
            }
        )
    }
    console.log(loanInBD);


    const bookInBD = await Book.findOne({ "isbn": loanInBD.bookIsbn });

    const userInBD = await User.findOne({ "cpf": loanInBD.userCpf });

    const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const loanForArchive = new ArchivedLoan({
        userCpf: loanInBD.userCpf,
        bookIsbn: loanInBD.bookIsbn,
        startDate: loanInBD.startDate,
        finishDate: loanInBD.finishDate,
        deletionDate: dateFormated
    });

    try {
        await Loan.deleteOne({ "_id": id });
        bookInBD.state = "free";

        await ArchivedLoan.create(loanForArchive);

        await Book.replaceOne({ "isbn": bookInBD.isbn }, bookInBD);

        userInBD.currentReservationsLoansQuantity--;
        await User.replaceOne({ "cpf": userInBD.cpf }, userInBD);

        res.status(200).json({ "message": "Loan deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

module.exports = {
    register,
    getAll,
    getById,
    updateById,
    deleteById
}