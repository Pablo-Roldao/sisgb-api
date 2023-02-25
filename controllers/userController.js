const User = require("../model/User");
const Loan = require("../model/Loan");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    const { name, cpf, birthDate, addres, email, password, roles } = req.body;

    const currentReservationsLoansQuantity = 0;

    if (!name) { return res.status(422).json({ "error": "The user must contains a name!" }); }
    if (!cpf) { return res.status(422).json({ "error": "The user must contains a CPF!" }); }
    if (!birthDate) { return res.status(422).json({ "error": "The user must contains a birth date!" }); }
    if (!addres) { return res.status(422).json({ "error": "The user must contains an adress!" }); }
    if (!email) { return res.status(422).json({ "error": "The user must contains an email!" }); }
    if (!password) { return res.status(400).json({ "error": "The user must contains a password!" }); }
    if (!roles) { return res.status(422).json({ "error": "The user must contains the roles!" }); }

    const duplicate = await User.findOne({ "cpf": cpf });
    if (duplicate) {
        return res.status(409).json({ "error": "An user with this CPF has already been registered." });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        cpf,
        birthDate,
        addres,
        email,
        password: hashedPwd,
        currentReservationsLoansQuantity,
        roles
    });

    try {
        await User.create(user);
        res.status(201).json({ "success": "User registered successfully!" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getAll = async (req, res) => {
    try {
        const users = await User.find();
        if (!users[0]) {
            return res.status(404).json({ "error": "No users registered!" });
        }
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const getByCpf = async (req, res) => {
    const cpf = req.body.cpf;
    if (!cpf) { return res.status(422).json({ "error": "The request must contains the user's CPF!" }) }
    try {
        const user = await User.findOne({ "cpf": cpf });
        if (!user) {
            return res.status(404).json({ "error": "User not found!" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const update = async (req, res) => {
    const { name, cpf, birthDate, addres, email, password, roles, currentReservationsLoansQuantity } = req.body;

    if (!name) { return res.status(422).json({ "error": "The user must contains a name!" }); }
    if (!cpf) { return res.status(422).json({ "error": "The user must contains a CPF!" }); }
    if (!birthDate) { return res.status(422).json({ "error": "The user must contains a birth date!" }); }
    if (!addres) { return res.status(422).json({ "error": "The user must contains an adress!" }); }
    if (!email) { return res.status(422).json({ "error": "The user must contains an email!" }); }
    if (!password) { return res.status(400).json({ "error": "The user must contains a password!" }); }
    if (!roles) { return res.status(422).json({ "error": "The user must contains the roles!" }); }

    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) {
        return res.status(404).json({ "error": "The user with this CPF was not found!" });
    }

    const user = new User({
        name,
        cpf,
        birthDate,
        addres,
        email,
        password,
        currentReservationLoansQuantity,
        roles
    });

    try {
        await User.replaceOne({ "cpf": cpf }, user);
        res.status(201).json({ "success": "User updated successfully!" })
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

const deleteByCpf = async (req, res) => {
    const cpf = req.body.cpf;

    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) {
        return res.status(404).json({ "error": "The user with this CPF was not found!" });
    }

    const foundLoans = await Loan.find({ "userCpf": cpf });
    if (foundLoans[0]) {
        return res.status(500).json({ "error": "User have open loans!" });
    }

    try {
        await User.deleteOne({ "cpf": cpf });

        res.status(200).json({ "success": "User deleted successfully!" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": `Error: ${error}` });
    }
}

module.exports = {
    register,
    getAll,
    getByCpf,
    update,
    deleteByCpf
}