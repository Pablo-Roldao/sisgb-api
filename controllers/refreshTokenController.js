const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ "refreshToken": refreshToken });
    if (!foundUser) {
        return res.status(404).json({"erorr": "User with this refreshToken not found!"});
    };

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.cpf !== decoded.cpf) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { "UserInfo": { "cpf": foundUser.cpf, "roles": roles } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '3600s' }
            );
            res.json({ accessToken });
        }
    );
}

module.exports = { handleRefreshToken };