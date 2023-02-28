const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;


const handleLogin = async (req, res) => {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
        return res.status(400).json({ 'message': 'CPF and password are required.' });
    }

    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) { return res.sendStatus(401) };

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {

        const rolesArrayObjects = Object.values(foundUser.roles);
        const roles = [];
        for (let i = 0; i < rolesArrayObjects.length; i++) {
            roles.push(rolesArrayObjects[i].code);
        }

        const accessToken = jwt.sign(
            { "UserInfo": { "cpf": foundUser.cpf, "roles": rolesArrayObjects } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600s' }
        );
        const refreshToken = jwt.sign(
            { "cpf": foundUser.cpf },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        );

        const user = {
            name: foundUser.name,
            cpf: foundUser.cpf,
            birthDate: foundUser.birthDate,
            addres: foundUser.addres,
            email: foundUser.email,
            password: foundUser.password,
            currentReservationsLoansQuantity: foundUser.currentReservationsLoansQuantity,
            refreshToken: refreshToken,
            roles: foundUser.roles
        }

        try {
            await User.replaceOne({ cpf: foundUser.cpf }, user);

            //res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken, roles, refreshToken, username: foundUser.name });
        } catch (error) {
            console.log(error);
            res.status(500).json({ "message": `Error: ${error}` });
        }

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };