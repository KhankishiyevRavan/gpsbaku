const Call = require("../models/Call");
const User = require("../models/User");
const Log = require("../models/Log");
const { sendSms } = require("../services/smsService");
const Role = require("../models/Role");
const Contract = require("../models/Contract");
exports.createCall = async (req, res) => {
  try {
    const { type, phoneNumber, fullName, address } = req.body;

    if (!phoneNumber.startsWith("+994")) {
      return res.status(400).json({
        message:
          "Telefon nömrəsi düzgün formatda deyil (+994 ilə başlamalıdır).",
      });
    }

    let callData = { type, phoneNumber, fullName, address };
    let contracts = []; // 🆕 müqavilələr üçün array

    if (type === "abuneci") {
      const role = await Role.findOne({ name: "abuneci" });
      if (!role) {
        return res.status(400).json({ message: "Role not found" });
      }

      const subscriber = await User.findOne({ phoneNumber, role: role._id });
      if (!subscriber) {
        return res.status(404).json({ message: "Istifadəçi tapılmadı" });
      }

      callData.fullName = `${subscriber.fname} ${subscriber.lname}`;
      callData.address = subscriber.address;

      // 🆕 subscriber-in müqavilələrini çək
      const contracts = await Contract.find({ subscriberId: subscriber._id });
      // console.log(
      //   contracts.map((c) => {
      //     return { contractNumber: c.contractNumber, contractId: c._id };
      //   })
      // );

      callData.contracts = contracts.map((c) => {
        return { contractNumber: c.contractNumber, contractId: c._id };
      });
    }

    const call = await Call.create(callData);

    const roleName = type === "abuneci" ? "usta" : "usta";
    const technicianRole = await Role.findOne({ name: roleName });

    if (!technicianRole) {
      return res.status(400).json({ message: "Role not found" });
    }

    const technicians = await User.find({
      role: technicianRole._id,
    });

    for (const tech of technicians) {
      const link = `https://app.gpsbaku.az/call/accept/${call._id}/${tech._id}`;
      const message =
        `🔔 Yeni çağırış!\n` +
        `👤 Ad: ${call.fullName}\n` +
        `📞 Tel: ${call.phoneNumber}\n` +
        `📍 Ünvan: ${call.address}\n` +
        `🔗 Qəbul linki: ${link}`;
      console.log(link);

      await sendSms(tech.phoneNumber, message);
    }

    // 🆕 Müqavilələri də cavaba əlavə et

    const responseObj = {
      ...call.toObject(),
      contracts: contracts.map((c) => c.toObject()),
    };
    return res.status(201).json(responseObj);
  } catch (error) {
    console.error("Error creating call:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.acceptCall = async (req, res) => {
  try {
    const { callId, technicianId } = req.params;

    const call = await Call.findById(callId);
    if (!call) {
      return res.status(404).send("Çağırış tapılmadı.");
    }

    if (
      call.assignedTechnician &&
      call.assignedTechnician.toString() === technicianId
    ) {
      return res.send("Siz artıq bu çağırışı qəbul etmisiniz.");
    }

    if (call.status === "finish" || call.status === "in_progress") {
      return res.send(
        "Bu çağırış artıq başqa bir usta tərəfindən qəbul olunub."
      );
    }

    call.status = "in_progress";
    call.assignedTechnician = technicianId;
    await call.save();

    await Log.create({
      action: "accept",
      callId: call._id,
      technicianId,
    });

    res.send("Çağırış uğurla qəbul edildi!");
  } catch (error) {
    console.error("Accept call error:", error);
    res.status(500).send("Çağırışı qəbul edərkən server xətası baş verdi.");
  }
};

exports.getAllCalls = async (req, res) => {
  try {
    const calls = await Call.find()
      .populate({
        path: "assignedTechnician",
        select: "fname lname",
      })
      .sort({ createdAt: -1 });

    // Bütün məlumatlar + ustanın adı:
    const result = calls.map((call) => {
      const callObj = call.toObject(); // plain object çevirmək üçün

      return {
        ...callObj,
        assignedTechnicianName: call.assignedTechnician
          ? `${call.assignedTechnician.fname} ${call.assignedTechnician.lname}`
          : null,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Get all calls error:", error);
    res.status(500).send("Server xətası.");
  }
};
exports.getCall = async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId).populate({
      path: "assignedTechnician",
      select: "fname lname",
    });

    if (!call) {
      return res.status(404).json({ message: "Çağırış tapılmadı." });
    }

    const callObj = call.toObject();

    const result = {
      ...callObj,
      assignedTechnicianName: call.assignedTechnician
        ? `${call.assignedTechnician.fname} ${call.assignedTechnician.lname}`
        : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Get call error:", error);
    res.status(500).send("Server xətası.");
  }
};
