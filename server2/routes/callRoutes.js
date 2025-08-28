const express = require("express");
const router = express.Router();
const callController = require("../controllers/callController");

router.post("/create", callController.createCall);
router.post("/accept/:callId/:technicianId", callController.acceptCall);
router.get("/calls", callController.getAllCalls);
router.get("/:callId", callController.getCall); 

module.exports = router;
