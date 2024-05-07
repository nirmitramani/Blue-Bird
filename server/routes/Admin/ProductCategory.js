const express = require("express");
const router = express.Router();
const ProductCategoryController = require("../../controllers/Admin/ProductCategoryController");
const UploadImage = require("../../middleware/UploadImage");

const productCategoryImageUpload = UploadImage('product-categories/');

// Apply the middleware to protect these routes
router.post("/reorder", ProductCategoryController.reorder);
router.get("/count", ProductCategoryController.counts);
router.get("/", ProductCategoryController.index);
router.post("/", productCategoryImageUpload.single('productcategoryimg'), ProductCategoryController.store);
router.get("/:id", ProductCategoryController.show);
router.put("/:id", productCategoryImageUpload.single('productcategoryimg'), ProductCategoryController.update);
router.put("/status/:id", ProductCategoryController.statusChnage);
router.delete("/:id", ProductCategoryController.delete);

module.exports = router;
