const express = require("express");
const router = express.Router();
const ChecklistController = require("../controllers/ChecklistController");

// Créer une tâche
router.post("/checklist", ChecklistController.createTask);

// Supprimer une tâche
router.delete("/checklist/:id", ChecklistController.deleteTask);

// Récupérer les tâches par prestataire
router.get("/checklist/prestataire/:prestataire_id", ChecklistController.getTasksByPrestataire);

module.exports = router;