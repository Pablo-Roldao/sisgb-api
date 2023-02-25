const User = require("../model/User");

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    const foundUser = User.findOne({ "refreshToken": refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(205);
    }

    foundUser.refreshToken = '';

    try {
        await User.replaceOne({cpf: foundUser.cpf}, foundUser);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({ "error": `Error: ${err}` });
    }
}

module.exports = { handleLogout };