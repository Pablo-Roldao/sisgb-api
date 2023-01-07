const express = require("express");
const router = require("express").Router();
const Loan = require("../models/Loan");
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
        return res.status(422).json(
            {
                "message": "User not found!"
            }
        );
    }

    const bookInBD = await Book.findOne({"isbn": bookIsbn});
    if (!bookInBD) {
        return res.status(422).json(
            {
                "message": "Book not found!"
            }
        );
    }

    if (bookInBD.state === "loaned") {
        return res.status(500).json(
            {
                "message": "Book loaned!"
            }
        );
    }

    if (userInBD.currentLoansQuantity === 3) {
        return res.status(500).json(
            {
                "message": "Current loans quantity fully!"
            }
        );
    }

    const loan = new Loan({
        userCpf,
        bookIsbn,
        startDate,
        finishDate
    });

    try {
        await Loan.create(loan);
        res.status(201).json({ "message": "Loan registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }

});

router.get("/get-all", async (req, res) => {
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
});

module.exports = router;