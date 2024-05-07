const express = require("express");
const router = express.Router();
const SaleController = require("../../controllers/Admin/SaleController");
const UploadImage = require("../../middleware/UploadImage");

const saleImageUpload = UploadImage('sale/');

// Apply the middleware to protect these routes
router.post("/reorder", SaleController.reorder);
router.get("/count", SaleController.counts);
router.get("/", SaleController.index);
router.post("/", saleImageUpload.single('saleimg'), SaleController.store);
router.get("/:id", SaleController.show);
router.put("/:id", saleImageUpload.single('saleimg'), SaleController.update);
router.put("/status/:id", SaleController.statusChnage);
router.delete("/:id", SaleController.delete);

module.exports = router;
