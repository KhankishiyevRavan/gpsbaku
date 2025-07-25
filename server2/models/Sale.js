// models/Sale.js
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  packages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServicePackage" }],
  discount: { type: Number, default: 0 },
  discountType: {
    type: String,
    enum: ["percent", "amount"],
    default: "percent",
  },
  paymentMethod: { type: String, enum: ["cash", "online"], required: true },
  executorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Ödənilib", "Ödəniş Gözləmədə"],
    default: "Ödəniş Gözləmədə",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
