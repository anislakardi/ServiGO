const pool = require("../config/database");

class ChecklistModel {
    // Créer une nouvelle tâche
    static async createTask({ titre, priorite, prestataire_id }) {
        try {
            const [result] = await pool.query(
                "INSERT INTO checklist (titre, priorite, prestataire_id) VALUES (?, ?, ?)",
                [titre, priorite, prestataire_id]
            );
            return result.insertId;
        } catch (error) {
            console.error("Erreur lors de la création de la tâche:", error);
            throw error;
        }
    }

    // Supprimer une tâche
    static async deleteTask(id) {
        try {
            const [result] = await pool.query(
                "DELETE FROM checklist WHERE id = ?",
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Erreur lors de la suppression de la tâche:", error);
            throw error;
        }
    }

    // Récupérer les tâches par prestataire_id
    static async getTasksByPrestataire(prestataire_id) {
        try {
            const [rows] = await pool.query(
                `SELECT id, titre, priorite, prestataire_id, date_creation
                 FROM checklist
                 WHERE prestataire_id = ?
                 ORDER BY date_creation DESC`,
                [prestataire_id]
            );
            return rows;
        } catch (error) {
            console.error("Erreur lors de la récupération des tâches par prestataire:", error);
            throw error;
        }
    }
}

module.exports = ChecklistModel;