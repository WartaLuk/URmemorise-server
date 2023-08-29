const User = require("../models/User");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const userId = await User.create(
      req.body.username,
      req.body.email,
      req.body.password,
      req.body.handle
    );
    res.status(201).send({ message: "User registered successfully", userId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
};


