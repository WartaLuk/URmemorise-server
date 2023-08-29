const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const auth = require("../middleware/auth");

router.post(
  "/",
  auth.verifyToken,
  auth.authenticateUser,
  photoController.addPhoto
);

router.get("/", photoController.getAllPhotos);

router.get("/:photoId", photoController.getPhoto);

router.put(
  "/:photoId",
  auth.verifyToken,
  auth.authenticateUser,
  photoController.updatePhoto
);

router.delete(
  "/:photoId",
  auth.verifyToken,
  auth.authenticateUser,
  photoController.deletePhoto
);

module.exports = router;
