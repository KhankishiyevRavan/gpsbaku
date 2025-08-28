const express = require("express");
const router = express.Router();
const {
  markMonthAsPaid,
  getAllPayments,
  getPaymentById,
  addBalancePayment,
} = require("../controllers/paymentController");

const { authMiddleware } = require("../middleware/auth");

router.post("/pay-month", authMiddleware, markMonthAsPaid);
router.get("/all", authMiddleware, getAllPayments);
router.get("/:id", authMiddleware, getPaymentById);
router.post("/balance-topup", authMiddleware, addBalancePayment);

module.exports = router;
