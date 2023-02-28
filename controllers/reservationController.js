const Reservation = require("../model/Reservation");
const User = require("../model/User");
const Book = require("../model/Book");
const Loan = require("../model/Loan");

const getActualDate = () => {
    return (new Date().toISOString().split('T')[0]);
}

const register = async (req, res) => {
    const { userCpf, bookIsbn } = req.body;

    const startDate = getActualDate();

    if (!userCpf) { return res.status(422).json({ "error": "The reservation must contains a CPF of an user!" }); }
    if (!bookIsbn) { return res.status(422).json({ "error": "The reservation must contains an ISBN of a book!" }); }

    const foundUser = await User.findOne({ "cpf": userCpf });
    if (!foundUser) {
        return res.status(404).json({ "error": "User not found!" });
    }

    const foundBook = await Book.findOne({ "isbn": bookIsbn });
    if (!foundBook) {
        return res.status(404).json({ "error": "Book not found!" });
    }

    if (foundBook.state === "loaned") {
        return res.status(409).json({ "error": "Book loaned!" });
    }
    if (foundBook.state === "reserved") {
        return res.status(409).json({ "error": "Book already reserved!" });
    }

    if (foundUser.currentReservationsLoansQuantity === 3) {
        return res.status(500).json({ "error": "Current loans/reservations quantity fully!" });
    }

    let finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 7);
    finishDate = finishDate.toISOString().split('T')[0];

    const reservation = new Reservation({
        userCpf,
        bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Reservation.create(reservation);

        foundBook.state = "reserved";
        await Book.replaceOne({ "isbn": foundBook.isbn }, foundBook);

        foundUser.currentReservationsLoansQuantity++;
        await User.replaceOne({ "cpf": foundUser.cpf }, foundUser);

        res.status(201).json({ "success": "Reservation registered successfully!" })
    } catch (err) {
        res.status(500).json({ "error": `Error: ${err}` });
    }

}

const getAll = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        /*if (!reservations[0]) {
            return res.status(404).json({ "error": "No reservations registered!" });
        }*/
        res.status(200).json(reservations);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getById = async (req, res) => {
    const id = req.body.id;
    if (!id) { return res.status(422).json({ "error": "The request must contains the reservation's id" }); }

    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ "error": "Reservation not found!" });
        }
        res.status(200).json(reservation);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const update = async (req, res) => {
    const { id, finishDate } = req.body;

    if (!id) { return res.status(422).json({ "error": "The request must contains the reservation's id" }); }
    if (!finishDate) { return res.status(422).json({ "error": "The reservation must contains a finish date!" }); }

    const foundReservation = await Reservation.findById(id);
    if (!foundReservation) {
        return res.status(404).json({ "error": "The reservation with this id was not found!" })
    }

    const reservation = new Reservation({
        _id: id,
        userCpf: foundReservation.userCpf,
        bookIsbn: foundReservation.bookIsbn,
        startDate: foundReservation.startDate,
        finishDate
    });

    try {
        await Reservation.replaceOne({ "_id": id }, reservation);
        res.status(201).json({ "success": "Reservation updated successfully!" })
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const deleteById = async (req, res) => {
    const id = req.body.id;
    if (!id) { return res.status(422).json({ "error": "The request must contains the reservation's id" }); }

    const foundReservation = await Reservation.findById(id);
    if (!foundReservation) {
        return res.status(404).json({ "error": "The reservation with this id was not found!" })
    }

    const foundBook = await Book.findOne({ "isbn": foundReservation.bookIsbn });

    const foundUser = await User.findOne({ "cpf": foundReservation.userCpf });

    /*const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;*/

    try {
        await Reservation.deleteOne({ "_id": id });

        foundBook.state = "free";
        await Book.replaceOne({ "isbn": foundBook.isbn }, foundBook);

        foundUser.currentReservationsLoansQuantity--;
        await User.replaceOne({ "cpf": foundUser.cpf }, foundUser);

        res.status(200).json({ "success": "Reservation deleted successfully!" });
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const tranformInLoan = async (req, res) => {
    const { id } = req.body;

    if (!id) { return res.status(422).json({ "error": "The request must contains the reservation's id" }); }

    const foundReservation = await Reservation.findById(id);
    if (!foundReservation) {
        return res.status(404).json({ "error": "The reservation with this id was not found!" })
    }

    const { userCpf, bookIsbn } = foundReservation;

    let finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 7);
    finishDate = finishDate.toISOString().split('T')[0];

    const loan = new Loan({
        "userCpf": userCpf,
        "bookIsbn": bookIsbn,
        "startDate": getActualDate(),
        "finishDate": finishDate
    });

    try {
        await Loan.create(loan);
        const foundBook = await Book.findOne({ "isbn": foundReservation.bookIsbn });
        if (!foundBook) {
            return res.status(404).json({ "error": "Book not found!" });
        }
        foundBook.state = "loaned";
        await Book.replaceOne({ "isbn": foundBook.isbn }, foundBook);
        await Reservation.deleteOne({ "_id": id });
        res.status(201).json({ "success": "Reservation transformed successfully!" })
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }

}

module.exports = {
    register,
    getAll,
    getById,
    update,
    deleteById,
    tranformInLoan
}