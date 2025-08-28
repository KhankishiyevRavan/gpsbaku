const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const { authMiddleware, requireRole } = require("../middleware/auth");

// Customer yaratmaq üçün əvvəl token yoxlayırıq və sonra rolu yoxlayırıq
router.post(
  "/create-customer",
  authMiddleware,
  requireRole("admin", "operator"),
  createCustomer
);

// Bütün customerları gətirmək
router.get(
  "/list",
  authMiddleware,
  requireRole("admin", "operator"), // istəsən burada customer da görə bilər, onu dəyişmək olar
  getAllCustomers
);

// Bir customeru ID ilə tapmaq
router.get("/list/:id", authMiddleware, requireRole("admin", "operator"), getCustomerById);

// Customeru yeniləmək
router.put("/list/:id", authMiddleware, requireRole("admin", "operator"), updateCustomer);

// Customeru silmək
router.delete(
  "/list/:id",
  authMiddleware,
  requireRole("admin", "operator"),
  deleteCustomer
);

module.exports = router;
