const ChecklistModel = require("../models/ChecklistModel");

class ChecklistController {
    // Créer une nouvelle tâche
    static async createTask(req, res) {
        try {
            const { titre, priorite, prestataire_id } = req.body;
            if (!titre || !priorite || !prestataire_id) {
                return res.status(400).json({ error: "titre, priorite et prestataire_id sont requis" });
            }
            const validPriorities = ["Basse", "Moyenne", "Haute"];
            if (!validPriorities.includes(priorite)) {
                return res.status(400).json({ error: "priorite invalide" });
            }
            const taskId = await ChecklistModel.createTask({ titre, priorite, prestataire_id });
            res.status(201).json({ message: "Tâche créée", taskId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la création de la tâche" });
        }
    }

    // Supprimer une tâche
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ChecklistModel.deleteTask(id);
            if (deleted) {
                return res.json({ message: "Tâche supprimée" });
            }
            return res.status(404).json({ error: "Tâche non trouvée" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la suppression de la tâche" });
        }
    }

    // Récupérer les tâches par prestataire_id
    static async getTasksByPrestataire(req, res) {
        try {
            const { prestataire_id } = req.params;
            const tasks = await ChecklistModel.getTasksByPrestataire(prestataire_id);
            res.json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la récupération des tâches par prestataire" });
        }
    }
}

module.exports = ChecklistController;