const express = require("express");
const router = express.Router();
const demandeController = require("../controllers/demandeController");

router.post("/demande", demandeController.creerDemande);
router.get("/demandes", demandeController.getAllDemandes);
router.get("/demandes/statut/:statut", demandeController.getDemandesByStatut);
router.get("/demandes/prestataire/:prestataire_id", demandeController.getDemandesByPrestataire);
router.get("/demandes/prestataire", demandeController.getDemandesByPrestataireName);
router.put("/demande/:id", demandeController.updateStatutDemande);
router.delete("/demande/:id", demandeController.supprimerDemande);

module.exports = router;