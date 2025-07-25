const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const { authMiddleware } = require("../middleware/auth");

// Yeni müqavilə yarat
router.post("/", contractController.createContract);

// Bütün müqavilələri götür
router.get("/", authMiddleware, contractController.getAllContracts);

// ID ilə müqaviləni götür
router.get("/:id", contractController.getContractById);

// ID ilə müqaviləni yenilə
router.put("/:id", contractController.updateContract);

// ID ilə müqaviləni sil
router.delete("/:id", contractController.deleteContract);

router.get(
  "/subscriber/:subscriberId",
  contractController.getContractsBySubscriberId
);

module.exports = router;
