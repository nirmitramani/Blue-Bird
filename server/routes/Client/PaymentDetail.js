const express = require("express");
const router = express.Router();
const PaymentDetailController = require("../../controllers/Client/PaymentDetailController");

// Apply the middleware to protect these routes
router.get("/", PaymentDetailController.index);
// router.post("/", PaymentDetailController.store);
router.get("/:id", PaymentDetailController.show);
router.put("/:id", PaymentDetailController.update);
router.put("/status/:id", PaymentDetailController.statusChnage);
router.delete("/:id", PaymentDetailController.delete);

module.exports = router;
