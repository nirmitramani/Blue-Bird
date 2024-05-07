const express = require("express");
const router = express.Router();
const CmsPagesController = require("../../controllers/Admin/CmsPagesController");

router.get("/count", CmsPagesController.counts);
router.get("/", CmsPagesController.index);
router.get("/:id", CmsPagesController.show);
router.put("/:id", CmsPagesController.update);


module.exports = router;
