const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
};

const authenticateUser = (req, res, next) => {
  try {
    const userId = req.userId;

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Server error during authentication" });
      }

      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      req.user = row;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during authentication" });
  }
};

module.exports = {
  verifyToken,
  authenticateUser,
};
