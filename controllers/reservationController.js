const Reservation = require("../model/Reservation");
const ArchivedReservation = require("../model/ArchivedReservation");
const User = require("../model/User");
const Book = require("../model/Book");

const register = async (req, res) => {
    const { userCpf, bookIsbn, startDate, finishDate } = req.body;

    if (!userCpf) {
        return res.status(422).json({ "message": "The reservation must contains a CPF of an user!" });
    }
    if (!bookIsbn) {
        return res.status(422).json({ "message": "The reservation must contains an ISBN of a book!" });
    }
    if (!startDate) {
        return res.status(422).json({ "message": "The reservation must contains an start date!" });
    }
    if (!finishDate) {
        return res.status(422).json({ "message": "The reservation must contains a finish date!" });
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
        return res.status(500).json({ "message": "Book loaned!" });
    }
    if (bookInBD.state === "reserved") {
        return res.status(500).json({ "message": "Book already reserved!" });
    }

    if (userInBD.currentReservationsLoansQuantity === 3) {
        return res.status(500).json({ "message": "Current loans/reservations quantity fully!" });
    }

    const reservation = new Reservation({
        userCpf,
        bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Reservation.create(reservation);

        bookInBD.state = "reserved";
        await Book.replaceOne({ "isbn": bookInBD.isbn }, bookInBD);

        userInBD.currentReservationsLoansQuantity = userInBD.currentReservationsLoansQuantity + 1;
        await User.replaceOne({ "cpf": userInBD.cpf }, userInBD);

        res.status(201).json({ "message": "Reservation registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }

}

const getAll = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        if (!reservations[0]) {
            return res.status(422).json({ "message": "No reservations registered!" });
        }
        res.status(200).json(reservations);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const getById =  async (req, res) => {
    const id = req.params.id;
    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(422).json({ "message": "Reservation not found!" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const update = async (req, res) => {
    const id = req.params.id;
    const { startDate, finishDate } = req.body;

    if (!startDate) {
        return res.status(422).json({ "message": "The reservation must contains an start date!" });
    }
    if (!finishDate) {
        return res.status(422).json({ "message": "The reservation must contains a finish date!" });
    }

    const reservationInBD = await Reservation.findById(id);
    if (!reservationInBD) {
        return res.status(422).json(
            {
                "message": "The reservation with this id was not found!"
            }
        )
    }

    const newReservation = new Reservation({
        _id: reservationInBD._id,
        userCpf: reservationInBD.userCpf,
        bookIsbn: reservationInBD.bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Reservation.replaceOne({ "_id": id }, newReservation);
        res.status(201).json({ "message": "Reservation updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const deleteById = async (req, res) => {
    const id = req.params.id;
    const reservationInBD = await Reservation.findById(id);
    if (!reservationInBD) {
        return res.status(422).json(
            {
                "message": "The reservation with this id was not found!"
            }
        )
    }
    console.log(reservationInBD);


    const bookInBD = await Book.findOne({ "isbn": reservationInBD.bookIsbn });

    const userInBD = await User.findOne({ "cpf": reservationInBD.userCpf });

    const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const reservationForArchive = new ArchivedReservation({
        userCpf: reservationInBD.userCpf,
        bookIsbn: reservationInBD.bookIsbn,
        startDate: reservationInBD.startDate,
        finishDate: reservationInBD.finishDate,
        deletionDate: dateFormated
    });

    try {
        await Reservation.deleteOne({ "_id": id });
        bookInBD.state = "free";

        await ArchivedReservation.create(reservationForArchive);

        await Book.replaceOne({ "isbn": bookInBD.isbn }, bookInBD);

        userInBD.currentReservationsLoansQuantity--;
        await User.replaceOne({ "cpf": userInBD.cpf }, userInBD);

        res.status(200).json({ "message": "Reservation deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

module.exports = {
    register,
    getAll,
    getById,
    update,
    deleteById
}