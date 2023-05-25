const getUser = async (req, res) => {
  return res.status(200).json({
    message: 'user router',
  });
}
module.exports = {
  getUser
}