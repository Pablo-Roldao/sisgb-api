const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const {cpf, pwd} = req.body;
    if (!cpf || !pwd) return res.status(400).json({ 'message': 'Username and password are required.'});
    const foundUser = await User.findOne({ "cpf": cpf });
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        //create JWTs 
        res.json({
            'message': `User ${user} is logged in!`
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };