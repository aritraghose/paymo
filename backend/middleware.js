const config = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if ((!authHeader) || (!authHeader.startsWith("Bearer"))) {
    return res.status(403).json({message: "Unauthorized access!"});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    return res.status(403).json({message: "Unauthorized access!"});
  }
}

module.exports = {
  authMiddleware
}