const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/photos/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {

  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); 
  } else {
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const uploadSingle = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).single("photo");

const uploadMultiple = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
}).array("photo", 5);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
