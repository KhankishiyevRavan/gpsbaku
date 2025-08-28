// controllers/saleController.js
const Sale = require("../models/Sale"); // yeni model
// const Contract = require("../models/Contract");

exports.createSale = async (req, res) => {
  try {
    const {
      executorId,
      subscriberId,
      packages,
      discount,
      discountType,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!executorId || !packages || packages.length === 0) {
      return res.status(400).json({ message: "Məlumatlar natamamdır" });
    }

    const status = paymentMethod === "cash" ? "Ödənilib" : "Ödəniş Gözləmədə";

    const newSale = new Sale({
      executorId,
      subscriberId,
      packages,
      discount,
      discountType,
      paymentMethod,
      totalPrice,
      status,
      createdAt: new Date(),
    });

    await newSale.save();

    return res.status(201).json({
      message: "Ödəniş qeydi uğurla yaradıldı",
      sale: newSale,
    });
  } catch (err) {
    console.error("Ödəniş xətası:", err);
    return res.status(500).json({ message: "Server xətası" });
  }
};
