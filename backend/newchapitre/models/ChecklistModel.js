const pool = require("../config/database");

class ChecklistModel {
    // Récupérer toutes les tâches
    static async getAllTasks() {
        try {
            const [rows] = await pool.query("SELECT * FROM checklist ORDER BY date_creation DESC");
            return rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches:", error);
            throw error;
        }
    }

    // Récupérer une tâche par son ID
    static async getTaskById(id) {
        try {
            const [rows] = await pool.query("SELECT * FROM checklist WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            console.error("Erreur lors de la récupération de la tâche:", error);
            throw error;
        }
    }

    // Créer une nouvelle tâche
    static async createTask(taskData) {
        try {
            const { titre, priorite } = taskData;
            const [result] = await pool.query(
                "INSERT INTO checklist (titre, priorite) VALUES (?, ?)",
                [titre, priorite]
            );
            return result.insertId;
        } catch (error) {
            console.error("Erreur lors de la création de la tâche:", error);
            throw error;
        }
    }

    // Mettre à jour une tâche
    static async updateTask(id, taskData) {
        try {
            const { titre, priorite, est_fait } = taskData;
            const [result] = await pool.query(
                "UPDATE checklist SET titre = ?, priorite = ?, est_fait = ? WHERE id = ?",
                [titre, priorite, est_fait, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la tâche:", error);
            throw error;
        }
    }

    // Supprimer une tâche
    static async deleteTask(id) {
        try {
            const [result] = await pool.query("DELETE FROM checklist WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche:", error);
            throw error;
        }
    }

    // Marquer une tâche comme terminée
    static async markTaskAsDone(id) {
        try {
            const [result] = await pool.query(
                "UPDATE checklist SET est_fait = TRUE WHERE id = ?",
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors du marquage de la tâche comme terminée:", error);
            throw error;
        }
    }
}

module.exports = ChecklistModel; 