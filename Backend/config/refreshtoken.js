const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, 'secret', { expiresIn: "1d" });
};

module.exports = { generateRefreshToken }