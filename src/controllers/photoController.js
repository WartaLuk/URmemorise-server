const Photo = require("../models/Photo");
const fs = require("fs");

exports.addPhoto = async (req, res) => {
  try {
    const { userId } = req;
    const { description } = req.body;
    const imageBuffer = req.file.buffer;

    const photoId = await Photo.create(userId, imageBuffer, description);
    res.status(201).send({ message: "Photo uploaded successfully", photoId });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addMultiplePhotos = async (req, res) => {
  try {
    const { userId } = req;
    const { description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No photos provided" });
    }

    const photoIds = [];

    for (const file of req.files) {
      const imageBuffer = file.buffer;
      const photoId = await Photo.create(userId, imageBuffer, description);
      photoIds.push(photoId);
    }

    res.status(201).send({
      message: `${req.files.length} photos uploaded successfully`,
      photoIds,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { userId, isAdmin } = req;

    await Photo.update(photoId, userId, isAdmin, req.body);
    res.status(200).send({ message: "Photo updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { userId, isAdmin } = req;

    const photo = await Photo.findById(photoId);
    if (photo) {
      fs.unlinkSync(photo.imagePath);
    }

    await Photo.delete(photoId, userId, isAdmin);
    res.status(200).send({ message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getPhotoById = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).send({ message: "Photo not found" });
    }
    res.status(200).send(photo);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUserPhotos = async (req, res) => {
  try {
    const { userId } = req.params;
    const photos = await Photo.findByUserId(userId);
    res.status(200).send(photos);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll();

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.likePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    await Photo.like(photoId);
    res.status(200).send({ message: "Photo liked successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.unlikePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    await Photo.unlike(photoId);
    res.status(200).send({ message: "Photo unliked successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
