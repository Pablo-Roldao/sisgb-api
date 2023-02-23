const User = require("../model/User");
const ArchivedUser = require("../model/ArchivedUser");
const Loan = require("../model/Loan");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { name, cpf, birthDate, addres, email, password, isFunctionary } = req.body;

    currentReservationsLoansQuantity = 0;

    if (name === undefined) {
        return res.status(422).json({ "message": "The user must contains a name!" });
    }
    if (cpf === undefined) {
        return res.status(400).json({ "message": "The user must contains a CPF!" });
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
        return res.status(400).json({ "message": "The user must contains a password!" });
    }
    if (isFunctionary === undefined) {
        return res.status(422).json({ "message": "The user must contains isFunctionary!" });
    }

    const duplicate = await User.findOne({ "cpf": cpf });
    if (duplicate) {
        return res.status(409).json(
            {
                "message": "An user with this CPF has already been registered."
            }
        );
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        cpf,
        birthDate,
        addres,
        email,
        password: hashedPwd,
        isFunctionary,
        currentReservationsLoansQuantity
    });

    try {
        await User.create(user);
        res.status(201).json({ "message": "User registered successfully!" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const getAll = async (req, res) => {
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
}

const getByCpf = async (req, res) => {
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
}

const update = async (req, res) => {
    const { name, cpf, birthDate, addres, email, password, isFunctionary, currentReservationsLoansQuantity } = req.body;

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

    const userInBD = await User.findOne({ "cpf": cpf });
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
        currentReservationLoansQuantity: currentReservationsLoansQuantity
    });

    try {
        await User.replaceOne({ "cpf": cpf }, newUser);
        res.status(201).json({ "message": "User updated successfully!" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

const deleteByCpf = async (req, res) => {
    const cpf = req.body.cpf;
    const userInBD = await User.findOne({ "cpf": cpf });
    if (!userInBD) {
        return res.status(422).json(
            {
                "message": "The user with this CPF was not found!"
            }
        )
    }

    const loansInBD = await Loan.find({ "userCpf": cpf });
    if (loansInBD[0]) {
        return res.status(422).json({ "message": "User have an open loan!" });
    }

    const date = new Date();
    const dateFormated = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const userForArchive = new ArchivedUser({
        name: userInBD.name,
        cpf: userInBD.cpf,
        birthDate: userInBD.birthDate,
        addres: userInBD.addres,
        email: userInBD.email,
        password: userInBD.password,
        isFunctionary: userInBD.isFunctionary,
        currentReservationsLoansQuantity: userInBD.currentReservationsLoansQuantity,
        deletionDate: dateFormated
    });

    try {
        await User.deleteOne({ "cpf": cpf });

        await ArchivedUser.create(userForArchive);

        res.status(200).json({ "message": "User deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
    }
}

module.exports = {
    register,
    getAll,
    getByCpf,
    update,
    deleteByCpf
}