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

exports.activateAccount = async (req, res) => {
  try {
    const token = req.body.token;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "Token is invalid or has expired." });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      if (user.isActivated) {
        return res
          .status(400)
          .send({ message: "Account is already activated." });
      }

      user.isActivated = true;
      await user.save();

      res.status(200).send({ message: "Account successfully activated." });
    });
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

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
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

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { username, email } = req.body;

    const updatedFields = {
      username,
      email,
    };

    const success = await User.updateById(userId, updatedFields);

    if (!success) {
      return res.status(400).json({ message: "Failed to update user profile" });
    }

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};


