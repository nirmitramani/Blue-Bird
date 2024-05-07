const express = require("express");
const router = express.Router();
const SliderController = require("../../controllers/Admin/SliderController");
const UploadImage = require("../../middleware/UploadImage");

const sliderUpload = UploadImage('slider/');

// Apply the middleware to protect these routes
router.post("/reorder", SliderController.reorder);
router.get("/count", SliderController.counts);
router.get("/:id", SliderController.show);
router.get("/", SliderController.index);
router.post("/", sliderUpload.single('sliderimg'), SliderController.store);
router.put("/:id", sliderUpload.single('sliderimg'), SliderController.update);
router.put("/status/:id", SliderController.statusChnage);
router.delete("/:id", SliderController.delete);

module.exports = router;
