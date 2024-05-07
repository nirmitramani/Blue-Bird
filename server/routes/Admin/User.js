const express = require("express");
const router = express.Router();
const UserController = require("../../controllers/Admin/UserController");
const UploadImage = require("../../middleware/UploadImage");
const profileUpload = UploadImage('user/');


// Apply the middleware to protect these routes
router.get("/count", UserController.counts);
router.put("/change-password/:id", UserController.changePassword);
router.get("/", UserController.index);
// router.post("/", ImageUpload.single('productcategoryimg'), UserController.store);
router.get("/:id", UserController.show);
router.get("/bytoken/:token", UserController.byToken);
router.put("/:id", profileUpload.single('profileimg'), UserController.update);
router.put("/status/:id", UserController.statusChnage);
router.delete("/:id", UserController.delete);

module.exports = router;
