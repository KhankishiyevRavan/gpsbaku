const Contract = require("../models/Contract");
const Sale = require("../models/Sale");
const Payment = require("../models/Payment");
const User = require("../models/User");
// const { parse, format } = require("date-fns");
// const { az } = require("date-fns/locale");

exports.markMonthAsPaid = async (req, res) => {
  const { contractId, month, amount, method } = req.body;
  const userId = req.user?.userId;

  const monthMap = {
    yanvar: "01",
    fevral: "02",
    mart: "03",
    aprel: "04",
    may: "05",
    iyun: "06",
    iyul: "07",
    avqust: "08",
    sentyabr: "09",
    oktyabr: "10",
    noyabr: "11",
    dekabr: "12",
  };

  function convertToYearMonth(monthString) {
    const [monthName, year] = monthString.toLowerCase().split(" ");
    const monthNumber = monthMap[monthName];
    if (!monthNumber || !year) return null;
    return `${year}-${monthNumber}`;
  }

  try {
    const contract = await Contract.findById(contractId);
    if (!contract)
      return res.status(404).json({ message: "Müqavilə tapılmadı" });

    const scheduleItem = contract.paymentSchedule.find(
      (m) => m.month === month
    );
    if (!scheduleItem)
      return res.status(404).json({ message: "Ay tapılmadı" });

    if (scheduleItem.paymentId)
      return res.status(400).json({ message: "Bu ay artıq ödənilib" });

    const user = await User.findById(contract.subscriberId);
    if (!user)
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "Ay dəyəri düzgün deyil." });
    }

    // 🗓 Azərbaycan ayını yyyy-MM formatına çeviririk
    const formattedMonth = convertToYearMonth(month);
    if (!formattedMonth) {
      return res.status(400).json({ message: "Tarix formatı uyğun deyil." });
    }

    // 🔒 Balans kifayət etmirsə, ödəniş etmə
    if (user.balance < amount) {
      return res.status(400).json({
        message: `Balans kifayət etmir. Mövcud balans: ${user.balance} AZN, tələb olunan məbləğ: ${amount} AZN.`,
      });
    }

    // 💳 Balansı azaldırıq
    user.balance -= amount;
    await user.save();

    // 🧾 Ödənişi yaradırıq
    const newPayment = await Payment.create({
      contractId,
      months: [formattedMonth],
      amount: amount,
      method: method,
      receivedBy: userId,
      status: "paid",
      paymentType: "monthly",
    });

    // 📅 Cədvəli yeniləyirik
    scheduleItem.paymentId = newPayment._id;
    scheduleItem.status = "paid";

    await contract.save();

    res.json({
      message: `${month} ayı üçün ödəniş uğurla balansdan icra olundu`,
      payment: newPayment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xəta: " + err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    const detailedPayments = await Promise.all(
      payments.map(async (payment) => {
        const contract = await Contract.findById(payment.contractId).select(
          "contractNumber"
        );
        const user = await User.findById(payment.receivedBy).select(
          "fname lname"
        );

        return {
          ...payment.toObject(),
          contractNumber: contract?.contractNumber || "Yoxdur",
          receivedByName: user ? `${user.fname} ${user.lname}` : "Naməlum",
        };
      })
    );

    res.status(200).json(detailedPayments);
  } catch (error) {
    console.error("Ödənişlər alınarkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id).populate(
      "contractId receivedBy"
    );

    if (!payment) {
      return res.status(404).json({ message: "Ödəniş tapılmadı" });
    }

    // Müqaviləyə bağlı istifadəçi məlumatını əlavə çək
    const contract = await Contract.findById(payment.contractId).populate(
      "subscriberId"
    );
    if (!contract) {
      return res.status(404).json({ message: "Müqavilə tapılmadı" });
    }

    const response = {
      paymentId: payment._id,
      amount: payment.amount,
      method: payment.method,
      type: payment.paymentType, // məsələn: "monthly", "balance", "yearly"
      months: payment.months,
      createdAt: payment.createdAt,
      contractNumber: contract.contractNumber,
      subscriber: {
        id: contract.subscriberId._id,
        fname: contract.subscriberId.fname,
        lname: contract.subscriberId.lname,
        packageName: contract.servicePackageName,
      },
      receivedBy: {
        id: payment.receivedBy?._id,
        fname: payment.receivedBy?.fname,
        lname: payment.receivedBy?.lname,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Ödəniş alınarkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};
exports.addBalancePayment = async (req, res) => {
  try {
    const { userId, amount, method } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Məbləğ düzgün deyil" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    // 1. Ödənişi qeyd edirik
    const newPayment = new Payment({
      contractId: null,
      subscriberId: userId,
      amount,
      paymentType: "balanceTopUp",
      method,
      receivedBy: req.user.userId, // kim tərəfindən
      description: "Balans artırma",
    });

    await newPayment.save();

    // 2. Balansı yeniləyirik
    user.balance = (user.balance || 0) + Number(amount);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Balans uğurla artırıldı",
      newBalance: user.balance,
      payment: newPayment,
    });
  } catch (err) {
    console.error("Balans artırılarkən xəta:", err);
    res.status(500).json({ message: "Server xətası" });
  }
};
