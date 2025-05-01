const express = require("express");
const router = express.Router();
const ChecklistController = require("../controllers/ChecklistController");

// Routes pour la checklist
router.get("/checklist", ChecklistController.getAllTasks);
router.get("/checklist/:id", ChecklistController.getTaskById);
router.post("/checklist", ChecklistController.createTask);
router.put("/checklist/:id", ChecklistController.updateTask);
router.delete("/checklist/:id", ChecklistController.deleteTask);
router.put("/checklist/:id/done", ChecklistController.markTaskAsDone);

module.exports = router; 