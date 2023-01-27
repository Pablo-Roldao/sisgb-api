    const express = require("express");
const router = require("express").Router();
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Book = require("../models/Book");

router.use(
    express.urlencoded(
        {
            extended: true
        }
    )
);
router.use(
    express.json()
);

router.post("/register", async (req, res) => {
    const {userCpf, bookIsbn, date, expirationDate} = req.body;

    if (!userCpf) {
        return res.status(422).json({ "message": "The reservation must contains a CPF of an user!" });
    }
    if (!bookIsbn) {
        return res.status(422).json({ "message": "The reservation must contains an ISBN of a book!" });
    }
    if (!date) {
        return res.status(422).json({ "message": "The reservation must contains an start date!" });
    }
    if (!expirationDate) {
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
        return res.status(500).json({ "message": "Book already has reserved!" });
    }

    const reservation = new Reservation({
        userCpf,
        bookIsbn,
        date,
        expirationDate
    });

    try {
        await Reservation.create(reservation);

        bookInBD.state = "reserved";
        await Book.replaceOne({ "isbn": bookInBD.isbn }, bookInBD);

        res.status(201).json({ "message": "Reserve registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }

}
);