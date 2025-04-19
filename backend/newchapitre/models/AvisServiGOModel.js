const pool = require("../config/database");

class AvisServiGOModel {
    // Créer un nouvel avis
    static async createAvis(avisData) {
        const [result] = await pool.query(
            "INSERT INTO avis_ServiGO (client_id, rating, service_rating, communication_rating, price_rating, comment) VALUES (?, ?, ?, ?, ?, ?)",
            [
                avisData.client_id,
                avisData.rating,
                avisData.service_rating,
                avisData.communication_rating,
                avisData.price_rating,
                avisData.comment
            ]
        );
        return result.insertId;
    }

    // Obtenir tous les avis
    static async getAllAvis() {
        const [rows] = await pool.query(`
            SELECT a.*, c.nom as user_name, c.avatar as user_avatar 
            FROM avis_ServiGO a 
            JOIN clients c ON a.client_id = c.id 
            ORDER BY a.date DESC
        `);
        return rows;
    }

    // Obtenir les avis récents
    static async getRecentAvis(limit = 10) {
        const [rows] = await pool.query(`
            SELECT a.*, c.nom as user_name, c.avatar as user_avatar 
            FROM avis_ServiGO a 
            JOIN clients c ON a.client_id = c.id 
            ORDER BY a.date DESC 
            LIMIT ?
        `, [limit]);
        return rows;
    }

    // Obtenir les statistiques globales
    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                AVG(note_moyenne) as moyenne_globale,
                COUNT(*) as total_avis,
                (COUNT(CASE WHEN note_moyenne >= 4 THEN 1 END) * 100.0 / COUNT(*)) as pourcentage_satisfaction
            FROM avis_ServiGO
        `);
        return rows[0];
    }

    // Mettre à jour un avis
    static async updateAvis(id, avisData) {
        const [result] = await pool.query(
            `UPDATE avis_ServiGO 
            SET rating = ?, 
                service_rating = ?, 
                communication_rating = ?, 
                price_rating = ?, 
                comment = ? 
            WHERE id = ?`,
            [
                avisData.rating,
                avisData.service_rating,
                avisData.communication_rating,
                avisData.price_rating,
                avisData.comment,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    // Supprimer un avis
    static async deleteAvis(id) {
        const [result] = await pool.query("DELETE FROM avis_ServiGO WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }

    // Vérifier si un client a déjà donné son avis
    static async hasClientAlreadyRated(clientId) {
        const [rows] = await pool.query(
            "SELECT * FROM avis_ServiGO WHERE client_id = ?",
            [clientId]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = AvisServiGOModel; 