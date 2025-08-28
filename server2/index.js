const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
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
const Role = require("./models/Role"); // Role modelini daxil edirik
const User = require("./models/User"); // User modelini daxil edirik

// Digər middleware-lərdən sonra əlavə et

dotenv.config();
console.log("✅ CLIENT_URL from .env:", process.env.CLIENT_URL);
const app = express();

// CORS parametrləri
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Müştəri URL-sinin sonunda slash olub-olmamasını yoxlayın
//       const allowedOrigin = 'https://app.gpsbaku.az';
//       if (origin === allowedOrigin || !origin) { // `!origin` boşluq üçün, lokal inkişaf üçün
//         return callback(null, true);
//       }
//       return callback(new Error('CORS policy: Not allowed origin'));
//     },
//     credentials: true,  // Cookies və ya digər məlumatların ötürülməsinə icazə verir
//   })
// );

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Middleware (JSON qəbul etmək üçün)
app.use(express.json());
// ✅ Cookie parser
app.use(cookieParser());

// API yollarını qeyd et
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/permissions", permissionRoutes);
// app.use("/api/rolepermissions", rolePermissionRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/servicepackage", servicePackageRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/repairs", repairRoutes);
app.use("/api/call", callRoutes);
// MongoDB-yə qoşulma
connectDB();

// Admin istifadəçisini yaratmaq
// const createAdminUser = async () => {
//   try {
//     const existingAdmin = await User.findOne({ fname: 'admin', lname: 'admin' });
//     if (!existingAdmin) {
//       const admin = new User({
//         fname: 'admin',
//         lname: 'admin',
//         email: process.env.ADMIN_EMAIL,
//         password: process.env.ADMIN_PASS,
//         role: 'admin',
//       });
//       await admin.save();
//       console.log('✅ Admin user created');
//     } else {
//       console.log('ℹ️ Admin user already exists');
//     }
//   } catch (err) {
//     console.error('Error creating admin user:', err);
//   }
// };

// createAdminUser() funksiyasını burada aktivləşdirin (bir dəfə işə salın)
// createAdminUser();

// Serveri başlatmaq
// const PORT = process.env.PORT || 5001;
// app.listen(5001, () => {
//   console.log("Server started on http://localhost:5001");
//   console.log("Swagger: http://localhost:5001/api-docs");
// });
// //
const createAdminRole = async () => {
  try {
    const existingRole = await Role.findOne({ name: "admin" });
    if (!existingRole) {
      const adminRole = new Role({
        name: "admin",
        showName: "Admin",

        permissions: ["create", "edit", "delete"], // Admin icazələri (istəyə uyğun əlavə edə bilərsiniz)
      });
      await adminRole.save();
      console.log("✅ Admin role created");
    } else {
      console.log("ℹ️ Admin role already exists");
    }
  } catch (err) {
    console.error("Error creating admin role:", err);
  }
};

// createAdminRole();

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({
      fname: "admin",
      lname: "admin",
    });

    // Əgər admin istifadəçisi artıq varsa, məlumat veririk
    if (!existingAdmin) {
      // Admin rolunu tapırıq
      const adminRole = await Role.findOne({ name: "admin" });

      // Admin rolunu tapmaq olmazsa, xəbərdarlıq veririk
      if (!adminRole) {
        console.log("Error: Admin role not found");
        return;
      }

      // Yeni admin istifadəçisi yaradılır
      const admin = new User({
        fname: "admin",
        lname: "admin",
        // fathername:"admin",
        // identityNumber:"1",
        // phoneNumber:"1",
        // address:"1",
        // bDate:"1",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASS,
        role: adminRole._id, // Admin rolunun ObjectId-si istifadəçiyə təyin edilir
      });

      await admin.save();
      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (err) {
    console.error("Error creating admin user:", err);
  }
};

// createAdminUser();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
