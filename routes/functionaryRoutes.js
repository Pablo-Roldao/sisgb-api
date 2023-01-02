const express = require("express");
const router = require("express").Router();
const User = require("../models/User");

router.use(
    express.urlencoded({
        extended: true
    })
);
router.user(express.json());

router.post("/register", async (req, res) => {
    const { name, cpf, birthDate, email, password } = req.body;
    const isFunctionary = true;

    if (!name || !cpf || !birthDate || !email || !password) {
        return res.status(422).json(
            {
                "message": "The functionary must contains name, cpf, birth date, email and password!"
            }
        );
    }

    const functionaryExists = await User.find({ "cpf": cpf });
    if (functionaryExists) {
        res.status(422).json(
            {
                "message": "A functionary with this CPF has already been registered."
            }
        );
    }

    const functionary = new User({
        name,
        cpf,
        birthDate,
        email,
        password
    });

    try {
        await User.create(functionary);
        res.status(201).json({ "message": "Functionary registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});