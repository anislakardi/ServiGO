const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");

router.post("/publications", publicationController.ajouterPublication);
router.get("/publications", publicationController.getAllPublications);
router.get("/publications/:id", publicationController.getPublicationById);
router.get("/publications/service/:service", publicationController.getPublicationsByService);
router.get("/publications/client/:client_id", publicationController.getPublicationByClient);
router.get("/publications/statut/:statut", publicationController.getPublicationsByStatus);
router.get("/publications/search", publicationController.searchPublications);
router.put("/publications/:id", publicationController.modifierPublication);
router.put("/publications/pause/:id", publicationController.pausePublication);
router.delete("/publications/:id", publicationController.supprimerPublication);

module.exports = router;
