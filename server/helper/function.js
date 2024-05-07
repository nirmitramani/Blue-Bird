const fs = require('fs');

// Define the common image delete function.
exports.deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};
