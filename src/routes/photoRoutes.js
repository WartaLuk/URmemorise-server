const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");
const auth = require("../middleware/auth");
const multer = require("multer");
const multerConfig = require("../config/multerConfig");

const upload = multer(multerConfig);

router.post(
  "/upload-single",
  auth.verifyToken,
  auth.authenticateUser,
  upload.single("photo"),
  photoController.addPhoto
);

router.post(
  "/upload-multiple",
  auth.verifyToken,
  auth.authenticateUser,
  upload.array("photos", 5),
  photoController.addMultiplePhotos
);

router.get("/", photoController.getAllPhotos);

router.get("/:photoId", photoController.getPhotoById);

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
