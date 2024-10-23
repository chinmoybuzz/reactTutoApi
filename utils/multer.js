const multer = require("multer");
const path = require("path");
const ALLOW_FILE_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".webp",
  ".mp3",
  ".csv",
];
// Multer config
const uploadDisk = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".pdf") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

const uploadBuffer = multer({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (!ALLOW_FILE_TYPES.includes(ext)) {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});
const upload = multer();
const acceptFormData = upload.any();

module.exports = { uploadDisk, uploadBuffer, acceptFormData };
