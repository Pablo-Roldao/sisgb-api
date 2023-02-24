const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { cpf, password } = req.body;
    if (!cpf || !password) {
        return res.status(400).json({ 'message': 'CPF and password are required.' });
    }
    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        //create JWTs 
        res.json({
            'message': `User ${cpf} is logged in!`
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };