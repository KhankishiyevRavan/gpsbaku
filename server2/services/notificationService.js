// services/notificationService.js
const Notification = require("../models/Notification");

// Utility funksiyadır – istənilən yerdə çağırıla bilər (API olmadan)
async function createNotification(data) {
  return await Notification.create(data);
}

module.exports = { createNotification };
