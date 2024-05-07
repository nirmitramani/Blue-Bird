const express = require("express");
const router = express.Router();
const FAQsController = require("../../controllers/Admin/FAQsController");

// Apply the middleware to protect these routes
router.post("/reorder", FAQsController.reorder);
router.get("/count", FAQsController.counts);
router.get("/", FAQsController.index);
router.post("/", FAQsController.store);
router.get("/:id", FAQsController.show);
router.put("/:id", FAQsController.update);
router.put("/status/:id", FAQsController.statusChnage);
router.delete("/:id", FAQsController.delete);

module.exports = router;
