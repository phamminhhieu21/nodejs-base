const jwt = require('jsonwebtoken')

const generateAccessToken = (id, role_code, name, mail) => jwt.sign({ id, role_code, name, mail }, process.env.JWT_SECRET, { expiresIn: '1d' })
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })


module.exports = {
    generateAccessToken,
    generateRefreshToken
}