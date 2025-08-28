// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    servicePackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      required: true,
    },
    servicePackageName: String,
    notificationDate: { type: Date, required: true },
    type: { type: String, default: "inspection" },
    status: { type: String, default: "pending" },
    message: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
