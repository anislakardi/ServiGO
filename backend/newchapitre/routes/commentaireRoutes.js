const express = require("express");
const router = express.Router();
const commentaireController = require("../controllers/commentaireController");

router.post("/commentaires", commentaireController.ajouterCommentaire);
router.get("/commentaires/publication/:publicationId", commentaireController.getCommentairesByPublication);
router.put("/commentaires/:commentaireId", commentaireController.modifierCommentaire);
router.delete("/commentaires/:commentaireId", commentaireController.supprimerCommentaire);

module.exports = router;