const mongoose = require("mongoose");

const servicePackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Paket adı
    description: { type: String }, // Paket təsviri
    identityNumber: { type: String, required: true, unique: true }, // Paket kodu
    // validity: { type: String, required: true }, // Ayla ifadə olunan etibarlılıq müddəti
    status: { type: String, enum: ["active", "passive"], default: "active" }, // Paket statusu
    technicalInspection: { type: String, enum: ["1", "2"], default: "1" }, // Texniki baxış sayı
    manualPrice: { type: Number, required: true }, // Əl ilə verilən qiymət
    discount: { type: Number, default: 0 }, // Faizlə endirim
    // selectedServices: [{ type: String, required: true }], // Seçilmiş xidmət ID-ləri (xidmət kodları)
    // autoprice: { type: Number, required: true }, // Seçilmiş xidmətlərin cəmi qiyməti
    totalPrice: { type: Number, required: true }, // Endirim sonrası yekun qiymət
  },
  {
    timestamps: true,
  }
);

const ServicePackage = mongoose.model("ServicePackage", servicePackageSchema);

module.exports = ServicePackage;
