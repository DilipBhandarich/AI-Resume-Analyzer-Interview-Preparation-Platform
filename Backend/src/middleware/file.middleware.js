const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), //temp memory
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Only PDF resumes are supported"));
    }
    callback(null, true);
  },
});

module.exports = upload;
