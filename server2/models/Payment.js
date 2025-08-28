const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: false,
    },
    months: [
      {
        type: String,
        match: /^\d{4}-\d{2}$/, // Məsələn "2025-08"
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },
    // models/Payment.js içində
    paymentType: {
      type: String,
      enum: ["monthly", "annual", "balanceTopUp"], // ayliq, illik, balans artırılması
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
