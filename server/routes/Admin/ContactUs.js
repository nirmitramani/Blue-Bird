const express = require("express");
const router = express.Router();
const ContactUsController = require("../../controllers/Admin/ContactUsController");

// Apply the middleware to protect these routes
router.get("/count", ContactUsController.counts);
router.get("/", ContactUsController.index);
router.post("/", ContactUsController.store);
router.get("/:id", ContactUsController.show);
router.put("/status/:id", ContactUsController.statusChnage);

module.exports = router;
