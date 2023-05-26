const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "You are not autherized" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};

module.exports = verify;
