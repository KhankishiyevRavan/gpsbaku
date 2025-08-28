const Contract = require("../models/Contract");
const User = require("../models/User"); // Yəqin ki subscriber burada User-dir
const Role = require("../models/Role"); // Role modelini daxil edirik
const ServicePackage = require("../models/ServicePackage"); // Əgər belə model varsa
const { createNotification } = require("../services/notificationService");
const Notification = require("../models/Notification");
const Payment = require("../models/Payment");
exports.createContract = async (req, res) => {
  try {
    const {
      combiModel,
      contractDuration,
      contractValue,
      endDate,
      initialPayment,
      servicePackage,
      servicePackageName,
      technicalInspection,
      startDate,
      status,
      subscriberId,
      subscriptionType,
      // terms,
    } = req.body;

    // Abunəçi yoxlama
    const user = await User.findById(subscriberId);
    if (!user) return res.status(404).json({ error: "Abunəçi tapılmadı" });

    if (!startDate || !endDate || !servicePackage || !contractValue) {
      return res.status(400).json({ error: "Vacib sahələr doldurulmalıdır" });
    }

    // Ən böyük contractNumber tapılır
    const lastContract = await Contract.findOne({})
      .sort({ contractNumber: -1 })
      .lean();

    let lastNumber = 0;
    if (lastContract && lastContract.contractNumber) {
      const match = lastContract.contractNumber.match(/C-(\d+)/);
      if (match) lastNumber = parseInt(match[1], 10);
    }

    const contractNumber = `C-${String(lastNumber + 1).padStart(5, "0")}`;
    const value = contractValue;

    // Ayları hesablamaq üçün fərq
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const monthlyAmount = Math.round((value / months) * 100) / 100;

    const paymentSchedule = [];
    for (let i = 1; i <= months; i++) {
      // əvvəl 0-dan başlayırdı
      const date = new Date(start);
      date.setMonth(date.getMonth() + i); // 1 ay sonraya keçir
      const monthName = date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "long",
      });
      paymentSchedule.push({ month: monthName, amount: monthlyAmount });
    }

    const contract = await Contract.create({
      combiModel,
      contractDuration,
      contractValue,
      endDate,
      initialPayment: initialPayment || 0,
      servicePackage,
      servicePackageName,
      startDate,
      status: status || "Gözləmədə",
      subscriberId,
      subscriptionType,
      // terms,
      technicalInspection,
      contractNumber,
      paymentSchedule,
    });
    // 🔔 Texniki baxışa uyğun notification-lar yaradılır
    const inspectionMonths =
      technicalInspection === "1"
        ? [6]
        : technicalInspection === "2"
        ? [3, 9]
        : [];

    let allNotifications = [];

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    // Neçə il varsa (12 ay = 1 il), o qədər dövr edir
    const yearCount = Math.floor(totalMonths / 12);

    for (let year = 0; year < yearCount; year++) {
      for (const baseMonth of inspectionMonths) {
        const finalMonth = baseMonth + year * 12;
        const notifDate = new Date(start);
        notifDate.setMonth(notifDate.getMonth() + finalMonth);

        const notification = await createNotification({
          contractId: contract._id,
          subscriberId,
          servicePackageId: servicePackage,
          servicePackageName,
          notificationDate: notifDate,
          type: "Texniki baxış",
          status: "pending",
          message: `${servicePackageName} üçün texniki baxış vaxtıdır (${finalMonth}. ay)`,
        });

        allNotifications.push(notification);
      }
    }
    let paymentNotifications = [];

    let currentPaymentDate = new Date(start);
    for (let i = 0; i < months; i++) {
      const notifDate = new Date(currentPaymentDate);
      notifDate.setMonth(notifDate.getMonth() + i);

      const paymentNotification = await createNotification({
        contractId: contract._id,
        subscriberId,
        servicePackageId: servicePackage,
        servicePackageName,
        notificationDate: notifDate,
        type: "Ödəniş günü",
        status: "pending",
        message: `${servicePackageName} üçün ödəniş vaxtıdır (${notifDate.toLocaleDateString(
          "az-AZ",
          { year: "numeric", month: "long", day: "numeric" }
        )})`,
      });

      paymentNotifications.push(paymentNotification);
    }

    res.status(201).json({
      message: "Müqavilə yaradıldı",
      contract,
      notifications: allNotifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xəta verdi" });
  }
};
exports.getAllContracts = async (req, res) => {
  try {
    const requesterRoleId = req.user.roleId;

    const role = await Role.findById(requesterRoleId);

    if (!role) {
      return res.status(403).json({ message: "İstifadəçinin rolu tapılmadı" });
    }

    let contracts = [];

    if (role.name === "admin") {
      contracts = await Contract.find();
    } else {
      const permissionsRoles = role.permissions?.roles || [];

      const readableRoleIds = permissionsRoles
        .filter((perm) => perm.permissions?.read)
        .map((perm) => perm.role.toString());

      if (readableRoleIds.length === 0) {
        return res.status(200).json([]);
      }

      const permittedUsers = await User.find({
        role: { $in: readableRoleIds },
      }).select("_id");

      const permittedUserIds = permittedUsers.map((user) => user._id);

      contracts = await Contract.find({
        subscriberId: { $in: permittedUserIds },
      });
    }

    // 🔽 ServicePackage-ləri çək
    const servicePackages = await ServicePackage.find();

    // 🔁 Contract-ları enriched (ad əlavə olunmuş) şəkildə göndər
    const enrichedContracts = contracts.map((contract) => {
      const matchedPackage = servicePackages.find(
        (pkg) => pkg._id.toString() === contract.servicePackage
      );

      return {
        ...contract.toObject(),
        servicePackageName: matchedPackage?.name || "Ad tapılmadı",
      };
    });

    return res.status(200).json(enrichedContracts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server xəta verdi" });
  }
};

// Müqaviləni id ilə gətirmək
exports.getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await Contract.findById(id);

    if (!contract) return res.status(404).json({ error: "Müqavilə tapılmadı" });

    // servicePackage adını tap
    const matchedPackage = await ServicePackage.findById(
      contract.servicePackage
    );

    const enrichedContract = {
      ...contract.toObject(),
      servicePackageName: matchedPackage?.name || "Ad tapılmadı",
    };

    res.status(200).json(enrichedContract);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xəta verdi" });
  }
};
// Müqaviləni yeniləmək (update)

exports.updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    let data;

    const contract = await Contract.findById(id);
    if (!contract) return res.status(404).json({ error: "Müqavilə tapılmadı" });

    const shouldRecalculateSchedule =
      !contract.paymentSchedule ||
      contract.paymentSchedule.length === 0 ||
      (updateData.contractValue !== undefined &&
        updateData.contractValue !== contract.contractValue) ||
      (updateData.startDate !== undefined &&
        new Date(updateData.startDate).getTime() !==
          new Date(contract.startDate).getTime()) ||
      (updateData.endDate !== undefined &&
        new Date(updateData.endDate).getTime() !==
          new Date(contract.endDate).getTime());

    if (shouldRecalculateSchedule) {
      const start = new Date(updateData.startDate || contract.startDate);
      const end = new Date(updateData.endDate || contract.endDate);
      const value = updateData.contractValue || contract.contractValue;

      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

      const monthlyAmount = Math.round((value / months) * 100) / 100;

      // Yeni cədvəl
      const paymentSchedule = [];
      for (let i = 1; i <= months; i++) {
        const date = new Date(start);
        date.setMonth(date.getMonth() + i);
        const monthName = date.toLocaleDateString("az-AZ", {
          year: "numeric",
          month: "long",
        });
        paymentSchedule.push({
          month: monthName,
          amount: monthlyAmount,
          status: "unpaid",
          paymentId: null,
        });
      }

      // Əvvəlki cədvəli götür
      const oldSchedule = contract.paymentSchedule || [];
      const oldPaidItems = oldSchedule.filter((item) => item.paymentId);

      const validPayments = [];
      const refundList = [];

      for (const oldItem of oldPaidItems) {
        const stillInNew = paymentSchedule.find(
          (item) => item.month === oldItem.month
        );
        const paymentExists = await Payment.exists({ _id: oldItem.paymentId });

        if (stillInNew && paymentExists) {
          stillInNew.paymentId = oldItem.paymentId;
          stillInNew.status = "paid";
        } else if (!stillInNew && paymentExists) {
          refundList.push(oldItem);
        }
      }

      // Ödənişi silinmiş aylar varsa – paymentId təmizlənir
      contract.paymentSchedule = contract.paymentSchedule.map((item) => {
        if (item.paymentId) {
          const isStillValid = oldPaidItems.some(
            (v) => v.paymentId?.toString() === item.paymentId?.toString()
          );
          if (!isStillValid) {
            return { ...item, paymentId: null, status: "unpaid" };
          }
        }
        return item;
      });

      // Refund üçün balans
      const refundAmount = refundList.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
      );
      if (refundAmount > 0) {
        await User.findByIdAndUpdate(contract.subscriberId, {
          $inc: { balance: refundAmount },
        });
      }

      // Yeni cədvəl əlavə olunur
      updateData.paymentSchedule = paymentSchedule;

      // Texniki baxış bildirişləri yenilənir
      const inspection =
        updateData.technicalInspection || contract.technicalInspection;
      const inspectionMonths =
        inspection === "1" ? [6] : inspection === "2" ? [3, 9] : [];

      const yearCount = Math.floor(months / 12);

      await Notification.deleteMany({
        contractId: contract._id,
        type: "Texniki baxış",
      });

      for (let year = 0; year < yearCount; year++) {
        for (const baseMonth of inspectionMonths) {
          const finalMonth = baseMonth + year * 12;
          const notifDate = new Date(start);
          notifDate.setMonth(notifDate.getMonth() + finalMonth);

          data = await createNotification({
            contractId: contract._id,
            subscriberId: contract.subscriberId,
            servicePackageId: contract.servicePackage,
            servicePackageName: contract.servicePackageName,
            notificationDate: notifDate,
            type: "Texniki baxış",
            status: "pending",
            message: `${contract.servicePackageName} üçün texniki baxış vaxtıdır (${finalMonth}. ay)`,
          });
        }
      }
      // 🔔 Ödəniş bildirişləri yenilənir
      await Notification.deleteMany({
        contractId: contract._id,
        type: "Ödəniş günü",
      });

      for (let i = 0; i < paymentSchedule.length; i++) {
        const notifDate = new Date(start);
        notifDate.setMonth(notifDate.getMonth() + i);

        await createNotification({
          contractId: contract._id,
          subscriberId: contract.subscriberId,
          servicePackageId: contract.servicePackage,
          servicePackageName: contract.servicePackageName,
          notificationDate: notifDate,
          type: "Ödəniş günü",
          status: "pending",
          message: `${
            contract.servicePackageName
          } üçün ödəniş vaxtıdır (${notifDate.toLocaleDateString("az-AZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })})`,
        });
      }
    }

    const updatedContract = await Contract.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Müqavilə yeniləndi",
      updatedContract,
      notifications: data || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xəta verdi" });
  }
};

// Müqaviləni silmək
exports.deleteContract = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContract = await Contract.findByIdAndDelete(id);
    if (!deletedContract)
      return res.status(404).json({ error: "Müqavilə tapılmadı" });
    res.status(200).json({ message: "Müqavilə silindi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xəta verdi" });
  }
};
// subscriberId ilə müqavilələri gətirmək
exports.getContractsBySubscriberId = async (req, res) => {
  try {
    const { subscriberId } = req.params;

    const contracts = await Contract.find({ subscriberId });

    if (contracts.length === 0) {
      return res.status(404).json({ error: "Heç bir müqavilə tapılmadı" });
    }

    // Bütün ServicePackage-ləri çəkirik
    const servicePackages = await ServicePackage.find();

    // ServicePackage adlarını contract-lara əlavə edirik
    const enrichedContracts = contracts.map((contract) => {
      const matchedPackage = servicePackages.find(
        (pkg) => pkg._id.toString() === contract.servicePackage
      );

      return {
        ...contract.toObject(),
        servicePackageName: matchedPackage?.name || "Ad tapılmadı",
      };
    });
    res.status(200).json(enrichedContracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xəta verdi" });
  }
};
