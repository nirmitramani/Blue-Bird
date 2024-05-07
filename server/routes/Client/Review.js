const express = require("express");
const router = express.Router();
const ReviewController = require("../../controllers/Client/ReviewController");

// Apply the middleware to protect these routes
router.get("/count", ReviewController.counts);
router.get("/", ReviewController.index);
router.post("/", ReviewController.store);
router.get("/:id", ReviewController.show);
router.put("/status/:id", ReviewController.statusChnage);
router.delete("/:id", ReviewController.delete);

module.exports = router;
