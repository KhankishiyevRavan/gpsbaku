const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    combiModel: { type: String, required: true },
    contractDuration: { type: String, required: true },
    contractValue: { type: Number, required: true },
    endDate: { type: Date, required: true },
    initialPayment: { type: Number, default: 0 },
    servicePackage: { type: String, required: true },
    servicePackageName: { type: String, required: true },
    startDate: { type: Date, required: true },
    status: { type: String, default: "Gözləmədə" },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ["monthly", "annually"],
      default: "monthly",
    },
    // terms: { type: String },
    technicalInspection: { type: String, enum: ["1", "2"], default: "1" }, // Texniki baxış sayı
    contractNumber: { type: String, required: true, unique: true },
    // 🔽 ÖDƏMƏ CƏDVƏLİ
    paymentSchedule: [
      {
        month: { type: String, required: true }, // "Fevral 2025"
        status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
        amount: { type: Number, required: true },
        paidAt: { type: Date },
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
