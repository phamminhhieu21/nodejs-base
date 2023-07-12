const jwt = require('jsonwebtoken')

const generateToken = (params, timeExpired = '5m') => jwt.sign(params, process.env.JWT_SECRET, {expiresIn: timeExpired})
const generateAccessToken = (params, expiresIn = '1h') => jwt.sign(params, process.env.JWT_SECRET, {expiresIn})
const generateRefreshToken = (id) => jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
const verifyToken = (token, secrectKey) => {
    let decodedData
    jwt.verify(token, secrectKey, (err, decoded) => {
        if (err) {
            decodedData = false
        }
        decodedData = decoded
    })
    return decodedData
}
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateToken,
    verifyToken
}