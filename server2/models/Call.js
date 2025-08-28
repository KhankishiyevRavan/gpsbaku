const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callSchema = new Schema({
  type: {
    type: String,
    enum: ["abuneci", "qeyriabuneci"],
    required: true,
  },
  contracts: [
    {
      contractNumber: { type: String },
      contractId: { type: Schema.Types.ObjectId, ref: "Contract" },
    },
  ],
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "finish", "in_progress"],
    default: "pending",
  },
  assignedTechnician: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Call", callSchema);
