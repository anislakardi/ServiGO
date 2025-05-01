const ChecklistModel = require("../models/ChecklistModel");

class ChecklistController {
    // Récupérer toutes les tâches
    static async getAllTasks(req, res) {
        try {
            const tasks = await ChecklistModel.getAllTasks();
            res.json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
        }
    }

    // Récupérer une tâche par son ID
    static async getTaskById(req, res) {
        try {
            const task = await ChecklistModel.getTaskById(req.params.id);
            if (!task) {
                return res.status(404).json({ error: "Tâche non trouvée" });
            }
            res.json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la récupération de la tâche" });
        }
    }

    // Créer une nouvelle tâche
    static async createTask(req, res) {
        try {
            const { titre, priorite } = req.body;
            
            if (!titre) {
                return res.status(400).json({ error: "Le titre est requis" });
            }
            
            const taskId = await ChecklistModel.createTask({ titre, priorite });
            res.status(201).json({ 
                message: "Tâche créée avec succès", 
                taskId 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la création de la tâche" });
        }
    }

    // Mettre à jour une tâche
    static async updateTask(req, res) {
        try {
            const { id } = req.params;
            const { titre, priorite, est_fait } = req.body;
            
            const task = await ChecklistModel.getTaskById(id);
            if (!task) {
                return res.status(404).json({ error: "Tâche non trouvée" });
            }
            
            const updated = await ChecklistModel.updateTask(id, { titre, priorite, est_fait });
            if (updated) {
                res.json({ message: "Tâche mise à jour avec succès" });
            } else {
                res.status(400).json({ error: "Échec de la mise à jour de la tâche" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
        }
    }

    // Supprimer une tâche
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            
            const task = await ChecklistModel.getTaskById(id);
            if (!task) {
                return res.status(404).json({ error: "Tâche non trouvée" });
            }
            
            const deleted = await ChecklistModel.deleteTask(id);
            if (deleted) {
                res.json({ message: "Tâche supprimée avec succès" });
            } else {
                res.status(400).json({ error: "Échec de la suppression de la tâche" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la suppression de la tâche" });
        }
    }

    // Marquer une tâche comme terminée
    static async markTaskAsDone(req, res) {
        try {
            const { id } = req.params;
            
            const task = await ChecklistModel.getTaskById(id);
            if (!task) {
                return res.status(404).json({ error: "Tâche non trouvée" });
            }
            
            const marked = await ChecklistModel.markTaskAsDone(id);
            if (marked) {
                res.json({ message: "Tâche marquée comme terminée avec succès" });
            } else {
                res.status(400).json({ error: "Échec du marquage de la tâche comme terminée" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors du marquage de la tâche comme terminée" });
        }
    }
}

module.exports = ChecklistController; 