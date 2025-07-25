const Repair = require("../models/Repair");
const User = require("../models/User");

const Call = require("../models/Call");
exports.getRepairsByContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const repairs = await Repair.find({ contractId })
      .populate("technician", "fullName")
      .sort({ repairDate: -1 });
    res.status(200).json(repairs);
  } catch (error) {
    console.error("Təmir siyahısı alınarkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

exports.createRepair = async (req, res) => {
  try {
    // 1️⃣ Yeni təmir yaradılır
    const newRepair = await Repair.create(req.body);

    // 2️⃣ Əgər çağırış ID göndərilibsə, həmin çağırışın statusunu dəyiş
    if (req.body.callId) {
      await Call.findByIdAndUpdate(req.body.callId, { status: "finish" });
    }

    res
      .status(201)
      .json({ message: "Təmir uğurla yaradıldı", repair: newRepair });
  } catch (error) {
    console.error("Təmir yaradılarkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

// exports.getAllRepairs = async (req, res) => {
//   try {
//     const repairs = await Repair.find().sort({ repairDate: -1 });

//     const repairsWithTechnicianName = await Promise.all(
//       repairs.map(async (repair) => {
//         let technicianFullName = "";
//         if (repair.technician) {
//           const technician = await User.findById(repair.technician);
//           if (technician) {
//             technicianFullName = `${technician.fname} ${technician.lname}`;
//           }
//         }

//         return {
//           ...repair.toObject(),  // repair-i düzəldib JS object-ə çeviririk
//           technicianFullName,   // yeni açar əlavə edirik
//         };
//       })
//     );

//     res.status(200).json(repairsWithTechnicianName);
//   } catch (error) {
//     console.error("Bütün təmir tarixçələri alınarkən xəta:", error);
//     res.status(500).json({ message: "Server xətası" });
//   }
// };

exports.getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find().sort({ repairDate: -1 });

    const enrichedRepairs = await Promise.all(
      repairs.map(async (repair) => {
        // Customer name tapılması
        let customerName = "";
        if (repair.callId) {
          const call = await Call.findById(repair.callId);
          if (call) {
            customerName = call.fullName;
          }
        }

        // Technician adı tapılması
        let technicianFullName = "";
        if (repair.technician) {
          const technician = await User.findById(repair.technician);
          if (technician) {
            technicianFullName = `${technician.fname} ${technician.lname}`;
          }
        }

        return {
          ...repair.toObject(),
          customerName,
          technicianFullName,
        };
      })
    );

    res.status(200).json(enrichedRepairs);
  } catch (error) {
    console.error("Bütün təmir siyahısı alınarkən xəta:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};
