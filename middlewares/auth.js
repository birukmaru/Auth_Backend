// middleware/auth.js
const jwt = require("jsonwebtoken");
const JT_SECRET = "mami";

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Invalid tokeeen." });
    }
    res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = auth;
