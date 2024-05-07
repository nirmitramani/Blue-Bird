const express = require("express");
const router = express.Router();
const OrderItemController = require("../../controllers/Client/OrderItemController");

// Apply the middleware to protect these routes
router.get("/", OrderItemController.index);
router.post("/", OrderItemController.store);
router.get("/:id", OrderItemController.show);
router.delete("/:id", OrderItemController.delete);

module.exports = router;
