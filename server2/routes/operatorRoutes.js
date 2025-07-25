const express = require("express");
const router = express.Router();
const {
  createOperator,
  getAllOperators,
  getOperatorById,
  updateOperator,
  deleteOperator,
} = require("../controllers/operatorController");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Operator yaratmaq üçün əvvəl token yoxlayırıq və sonra rolu yoxlayırıq
router.post(
  "/create-operator",
  authMiddleware, // 1. Token varsa, req.user doldurulur
  requireRole("admin"), // 2. User-in rolu admin olmalıdır
  createOperator // 3. Operator yaradılır
);

// Bütün operatorları gətirmək
router.get("/operators", getAllOperators);

router.get(
  "/list",
  authMiddleware,
  requireRole("admin"), // istəsən burada operator da görə bilər, onu dəyişmək olar
  getAllOperators
);

// Bir operatoru ID ilə tapmaq
router.get(
  "/list/:id",
  authMiddleware,
  requireRole("admin"),
  getOperatorById
);

// Operatoru yeniləmək
router.put(
  "/list/:id",
  authMiddleware,
  requireRole("admin"),
  updateOperator
);

// Operatoru silmək
router.delete(
  "/list/:id",
  authMiddleware,
  requireRole("admin"),
  deleteOperator
);

module.exports = router;
