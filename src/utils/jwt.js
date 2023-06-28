const jwt = require('jsonwebtoken')

const generateToken = (params, timeExpired) => jwt.sign(params, process.env.JWT_SECRET, { expiresIn: timeExpired })
const generateAccessToken = (id, role_code, name, mail) => jwt.sign({
  id,
  role_code,
  name,
  mail
}, process.env.JWT_SECRET, { expiresIn: '1d' })
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
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