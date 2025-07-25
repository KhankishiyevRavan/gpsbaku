const ServicePackage = require("../models/ServicePackage");
const Role = require("../models/Role");

exports.createServicePackage = async (req, res) => {
  try {
    const user = req.user;

    // 1. İstifadəçi rolunu tap
    const role = await Role.findById(user.roleId);

    // 2. Əgər admin-disə, icazə ver
    if (role?.name === "admin") {
      // davam et
    }
    // 3. Əgər admin deyil və permission-larda create yoxdursa, rədd et
    else if (
      !user.permissions ||
      !user.permissions.servicePackage ||
      user.permissions.servicePackage.create !== true
    ) {
      return res.status(403).json({
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }

    // 4. Eyni adda servis paketi varmı, yoxla
    const existingPackage = await ServicePackage.findOne({
      name: req.body.name,
    });
    if (existingPackage) {
      return res.status(400).json({
        errors: {
          name: "Eyni adda servis paketi artıq mövcuddur",
        },
      });
    }

    // 5. Əməliyyatı yerinə yetir
    const newPackage = new ServicePackage(req.body);
    const savedPackage = await newPackage.save();
    res
      .status(201)
      .json({ message: "Servis paketi uğurla yaradıldı", savedPackage });
  } catch (error) {
    console.error("Servis paketi yaradarkən xəta baş verdi:", error);
    res.status(400).json({ error: error.message });
  }
};

// Bütün paketləri gətir
exports.getAllServicePackages = async (req, res) => {
  try {
    const user = req.user;

    // 1. Rol tap
    const role = await Role.findById(user.roleId);

    // 2. Admin yoxdursa və read icazəsi yoxdursa, rədd et
    if (
      role?.name !== "admin" &&
      (!user.permissions ||
        !user.permissions.servicePackage ||
        user.permissions.servicePackage.read !== true)
    ) {
      return res.status(403).json({
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }

    // 3. Servis paketlərini gətir
    const packages = await ServicePackage.find();
    // console.log(packages);

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tək bir paketi ID ilə gətir
exports.getServicePackageById = async (req, res) => {
  try {
    const package = await ServicePackage.findById(req.params.id);
    if (!package) return res.status(404).json({ error: "Paket tapılmadı" });
    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paketi yenilə
exports.updateServicePackage = async (req, res) => {
  try {
    const user = req.user;

    // 1️⃣ Rol yoxla
    const role = await Role.findById(user.roleId);

    // 2️⃣ Admin yoxdursa və edit icazəsi yoxdursa, rədd et
    if (
      role?.name !== "admin" &&
      (!user.permissions ||
        !user.permissions.servicePackage ||
        user.permissions.servicePackage.edit !== true)
    ) {
      return res.status(403).json({
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }

    // 3️⃣ Paket mövcudluğunu yoxla və yenilə
    const updatedPackage = await ServicePackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPackage)
      return res.status(404).json({ error: "Paket tapılmadı" });

    res.status(200).json({ message: "Paket uğurla yeniləndi", updatedPackage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Paketi sil
exports.deleteServicePackage = async (req, res) => {
  try {
    const deleted = await ServicePackage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Paket tapılmadı" });
    res.status(200).json({ message: "Paket silindi" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
