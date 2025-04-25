const express = require("express");
const router = express.Router();
const RecommandationController = require("../controllers/recommandationController");

// Ajouter une recommandation
router.post("/recommandations", RecommandationController.createRecommandation);
router.get("/recommandations/publication/:id_publication", RecommandationController.getRecommandationsByPublication);

module.exports = router;
