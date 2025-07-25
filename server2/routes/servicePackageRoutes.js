const express = require("express");
const router = express.Router();
const servicePackageController = require("../controllers/servicePackageController");
const { authMiddleware } = require("../middleware/auth");

// Yeni service package yarat
router.post("/", authMiddleware, servicePackageController.createServicePackage);

// Bütün service paketləri gətir
router.get("/", authMiddleware, servicePackageController.getAllServicePackages);

// Tək bir service paketini ID ilə gətir
router.get("/:id", servicePackageController.getServicePackageById);

// Service paketini yenilə
router.put(
  "/:id",
  authMiddleware,
  servicePackageController.updateServicePackage
);

// Service paketini sil
router.delete("/:id", servicePackageController.deleteServicePackage);

module.exports = router;
