const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: false,
    },
    repairDate: { type: Date, required: true },
    repairPrice: { type: String, required: true },
    repairTime: { type: String, required: true }, // "14:30" formatında
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["ugurlu", "ugursuz"], required: true },
    partsAdded: { type: Boolean, default: false },
    notes: { type: String },
    callId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Repair", repairSchema);
