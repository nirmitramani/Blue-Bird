const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/Admin/ProductsController");
const UploadImage = require("../../middleware/UploadImage");

const productUpload = UploadImage('products/');

// Apply the middleware to protect these routes
router.post("/reorder", ProductController.reorder);
router.get("/count", ProductController.counts);
router.get("/", ProductController.index);
router.post("/", productUpload.any(), ProductController.store);
router.get("/:id", ProductController.show);
router.put("/:id", productUpload.any(), ProductController.update);
router.delete("/:id", ProductController.delete);
router.put("/status/:id", ProductController.statusChnage);

module.exports = router;