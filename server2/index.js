const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✅ CLIENT_URL:", process.env.CLIENT_URL);
console.log("✅ WIALON_BASE:", process.env.WIALON_BASE);

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const contractRoutes = require("./routes/contractRoutes");
const servicePackageRoutes = require("./routes/servicePackageRoutes");
const saleRoutes = require("./routes/saleRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const repairRoutes = require("./routes/repairRoutes");
const callRoutes = require("./routes/callRoutes");

const app = express();

/* ---- CORS (allowlist) ---- */
const allowlist = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/CLI üçün
      if (allowlist.length === 0 || allowlist.includes(origin))
        return cb(null, true);
      return cb(new Error("CORS: Not allowed origin"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

/* ---- Sənin mövcud routelar ---- */
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/servicepackage", servicePackageRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/repairs", repairRoutes);
app.use("/api/call", callRoutes);

/* ---- Wialon router (yeni) ---- */
app.use("/api/wialon", require("./routes/wialonRoutes"));

/* ---- DB və server ---- */
connectDB();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
