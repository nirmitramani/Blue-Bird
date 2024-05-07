const express = require("express");
const router = express.Router();
const CouponCodeController = require("../../controllers/Admin/CouponCodeController");

// Apply the middleware to protect these routes
router.post("/reorder", CouponCodeController.reorder);
router.get("/count", CouponCodeController.counts);
router.get("/", CouponCodeController.index);
router.post("/", CouponCodeController.store);
router.get("/:id", CouponCodeController.show);
router.get("/validate-code/:id", CouponCodeController.validateCode);
router.put("/:id", CouponCodeController.update);
router.put("/status/:id", CouponCodeController.statusChnage);
router.delete("/:id", CouponCodeController.delete);

module.exports = router;