const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);

router.post("/activate", userController.activateAccount);

router.post("/login", userController.login);

router.get(
  "/profile",
  auth.verifyToken,
  auth.authenticateUser,
  userController.getUserProfile
);

router.put(
  "/profile",
  auth.verifyToken,
  auth.authenticateUser,
  userController.updateUserProfile
);

module.exports = router;
