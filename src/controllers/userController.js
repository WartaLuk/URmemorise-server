const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Email not found in the database." });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Incorrect password." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("auth_token", token)
      .status(200)
      .send({ message: "Logged in successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.updateProfile(req.userId, req.body);
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ message: "Current password is incorrect." });
    }

    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await User.updatePassword(req.userId, newPassword);
    res.status(200).send({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("auth_token");
  res.status(200).send({ message: "Logged out successfully." });
};

exports.deleteAccount = async (req, res) => {
  try {
    const result = await User.delete(req.userId);
    if (!result) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({ message: "Account deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
