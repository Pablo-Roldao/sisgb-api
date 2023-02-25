const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = User.findOne({ "refreshToken": refreshToken });
    if (!foundUser) {
        return res.sendStatus(403)
    };

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.cpf != decoded.cpf) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "cpf": decoded.cpf },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3600s' }
            );
            res.json({ accessToken });
        }
    );
}

module.exports = { handleRefreshToken };