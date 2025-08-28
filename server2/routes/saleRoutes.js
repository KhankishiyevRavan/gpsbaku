const express = require("express");
const router = express.Router();
const { createSale } = require("../controllers/saleController");

// POST /api/sale → yeni ödəniş əlavə edir
router.post("/create", createSale);

module.exports = router;
