const express = require("express");
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const login = require("../middleware/login")



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

router.post("/register", login.obrigatorio, async (req, res) => {
    const { name, cpf, birthDate, addres, email, password, isFunctionary } = req.body;

    currentLoansQuantity = 0;

    if (name === undefined) {
        return res.status(422).json({ "message": "The user must contains a name!" });
    }
    if (cpf === undefined) {
        return res.status(422).json({ "message": "The user must contains a CPF!" });
    }
    if (birthDate === undefined) {
        return res.status(422).json({ "message": "The user must contains a birth date!" });
    }
    if (addres === undefined) {
        return res.status(422).json({ "message": "The user must contains an adress!" });
    }
    if (email === undefined) {
        return res.status(422).json({ "message": "The user must contains an email!" });
    }
    if (password === undefined) {
        return res.status(422).json({ "message": "The user must contains a password!" });
    }
    if (isFunctionary === undefined) {
        return res.status(422).json({ "message": "The user must contains isFunctionary!" });
    }

    const userInBD = await User.findOne({ "cpf": cpf });
    if (userInBD) {
        return res.status(422).json(
            {
                "message": "An user with this CPF has already been registered."
            }
        );
    }
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        cpf,
        birthDate,
        addres,
        email,
        password: passwordHash,
        isFunctionary,
        currentLoansQuantity
    });

    try {
        await User.create(user);
        res.status(201).json({ "message": "User registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.get("/get-by-cpf/:cpf", login.obrigatorio, async (req, res) => {
    const cpf = req.params.cpf;
    try {
        const user = await User.findOne({ "cpf": cpf });
        if (!user) {
            return res.status(422).json({ "message": "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.get("/get-all", login.opcional, async (req, res) => {
    try {
        const users = await User.find();
        if (!users[0]) {
            return res.status(422).json({ "message": "No users registered!" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.post("/update/:cpf", login.obrigatorio, async (req, res) => {
    const oldCpf = req.params.cpf;
    const { name, cpf, birthDate, addres, email, password, isFunctionary, currentLoansQuantity } = req.body;

    if (!name) {
        return res.status(422).json({ "message": "The user must contains a name!" });
    }
    if (!cpf) {
        return res.status(422).json({ "message": "The user must contains a CPF!" });
    }
    if (!birthDate) {
        return res.status(422).json({ "message": "The user must contains a birth date!" });
    }
    if (!addres) {
        return res.status(422).json({ "message": "The user must contains an adress!" });
    }
    if (!email) {
        return res.status(422).json({ "message": "The user must contains an email!" });
    }
    if (!password) {
        return res.status(422).json({ "message": "The user must contains a password!" });
    }
    if (isFunctionary === undefined) {
        return res.status(422).json({ "message": "The user must contains isFunctionary!" });
    }

    const userInBD = await User.findOne({ "cpf": oldCpf });
    if (!userInBD) {
        return res.status(422).json(
            {
                "message": "The user with this CPF was not found!"
            }
        )
    }

    const newUser = new User({
        _id: userInBD._id,
        name,
        cpf,
        birthDate,
        addres,
        email,
        password,
        isFunctionary,
        currentLoansQuantity
    });

    try {
        await User.replaceOne({ "cpf": oldCpf }, newUser);
        res.status(201).json({ "message": "User updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});

router.delete("/delete/:cpf", login.obrigatorio, async (req, res) => {
    const cpf = req.params.cpf;
    const userInBD = await User.findOne({ "cpf": cpf });
    if (!userInBD) {
        return res.status(422).json(
            {
                "message": "The user with this CPF was not found!"
            }
        )
    }

    try {
        await User.deleteOne({ "cpf": cpf });
        res.status(200).json({ "message": "User deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
});


router.post("/login", async (req, res) => {

    const { cpf, password } = req.body;

    if (!cpf) {
        return res.status(422).json({ msg: "The login must contains a CPF!" });
    }

    if (!password) {
        return res.status(422).json({ msg: "The login must containts a password!" });
    }

    const userInBD = await User.findOne({ cpf: cpf });

    if (!userInBD) {
        return res.status(404).json({ "message": "User not found!" })
    }

    const checkPassword = bcrypt.compare(password, userInBD.password)

    if (!checkPassword) {
        return res.status(422).json({ "message": "Invalid password!" })
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
                id: userInBD._id,
                cpf: userInBD.cpf

            },
            secret,
        );

        res.status(200).json({ "message": "Autentificação realizada com Sucesso", token });
    } catch (error) {
        console.log(err);
        res.status(500).json({ "message": error });
    }


})


module.exports = router;