const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/auth");

router.post("/", notificationController.createNotification);
router.get("/", authMiddleware, notificationController.getAllNotifications);
router.put("/:id/status", notificationController.updateNotificationStatus);

module.exports = router;
