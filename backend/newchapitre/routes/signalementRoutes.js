const express = require("express");
const router = express.Router();
const SignalementController = require("../controllers/signalementController");


router.get("/signalements", SignalementController.getAllSignalements);
router.get("/signalements/type/:type", SignalementController.getSignalementsByType);
router.get("/signalements/:id", SignalementController.getSignalementById);
router.post("/signalements", SignalementController.createSignalement);
router.put("/signalements/statut/:id", SignalementController.updateStatutSignalement);
router.delete("/signalements/:id", SignalementController.deleteSignalement);

module.exports = router;
