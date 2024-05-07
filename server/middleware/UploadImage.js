const multer = require('multer');
const path = require('path');

module.exports = (uploadPath) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/' + uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|webp/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        const error = new Error("Only JPG, JPEG, webp or PNG images are allowed");
        return cb(error);
      }
    },
  });
  return upload;
};
