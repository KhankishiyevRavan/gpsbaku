const Notification = require("../models/Notification");

// 🔹 Bildiriş yaratmaq (manual)
exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: "Notifikasiya yaradıldı", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Bütün bildirişləri gətir
const User = require("../models/User"); // və ya uyğun path

exports.getAllNotifications = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let start = startDate ? new Date(startDate) : new Date(now);
    let end = endDate ? new Date(endDate) : new Date(now);

    if (!startDate) {
      start.setMonth(start.getMonth() - 1);
    }

    if (!endDate) {
      end.setMonth(end.getMonth() + 2);
    }

    let filter = {
      notificationDate: {
        $gte: start,
        $lte: end,
      },
    };

    if (req.user && req.user.role === "abuneci") {
      filter.subscriberId = req.user.userId;
    }

    const notifications = await Notification.find(filter).sort({
      notificationDate: 1,
    });

    const subscriberIds = notifications.map((n) => n.subscriberId);

    const users = await User.find({ _id: { $in: subscriberIds } }).select(
      "fname lname"
    );

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id.toString()] = `${user.fname} ${user.lname}`;
    });

    const result = notifications.map((n) => ({
      ...n.toObject(),
      subscriberName: userMap[n.subscriberId.toString()] || "Təyin olunmayıb",
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Bildirişlər çəkilərkən xəta:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Bildirişin statusunu dəyiş
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
