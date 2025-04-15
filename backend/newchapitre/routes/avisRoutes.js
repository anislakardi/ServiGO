const express = require("express");
const router = express.Router();
const avisController = require("../controllers/avisController");


router.post("/avis", avisController.ajouterAvis);
router.get("/avis/prestataire/:prestataireId", avisController.getAvisByPrestataire);
router.put("/avis/:avisId",avisController.modifierAvis); 
router.delete("/avis/:avisId", avisController.supprimerAvis);

module.exports = router;
