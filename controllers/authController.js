const User = require('../model/User');
const CurrentUser = require('../model/CurrentUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config;


const handleLogin = async (req, res) => {
    const { cpf, password } = req.body;
    if (!cpf || !password) {
        return res.status(400).json({ 'message': 'CPF and password are required.' });
    }
    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            { "cpf": foundUser.cpf },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600s' }
        );
        const refreshToken = jwt.sign(
            { "cpf": foundUser.cpf },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' }
        );

        const currentUser = {
            cpf: foundUser.cpf,
            password: foundUser.password,
            refreshToken: refreshToken
        };

        try {
            const duplicate = await CurrentUser.findOne({ "cpf": foundUser.cpf });
            if (duplicate) {
                await CurrentUser.replaceOne({ "cpf": foundUser.cpf }, currentUser);
            } else {
                await CurrentUser.create(currentUser);
            }
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken });
        } catch (error) {
            console.log(error);
            res.status(500).json({ "message": "An unexpected error occurred, please try again later!" });
        }

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };