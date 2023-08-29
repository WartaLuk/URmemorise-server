const Photo = require("../models/Photo");

exports.uploadPhoto = async (req, res) => {
  try {
    const photoId = await Photo.upload(
      req.file.path,
      req.body.description,
      req.userId
    );
    res.status(201).send({ message: "Photo uploaded successfully", photoId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.likePhoto = async (req, res) => {
};

exports.tagUserInPhoto = async (req, res) => {
};
