const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repairController");

router.post("/", repairController.createRepair);
router.get("/:contractId", repairController.getRepairsByContract);
router.get("/all/list", repairController.getAllRepairs);

module.exports = router;
