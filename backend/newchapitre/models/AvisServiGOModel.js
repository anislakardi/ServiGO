const pool = require("../config/database");

class AvisServiGOModel {
    // Créer un nouvel avis
    static async createAvis({ client_id, rating, service_rating, communication_rating, price_rating, comment }) {
        const [result] = await pool.query(
            `INSERT INTO avis_ServiGO 
             (client_id, rating, service_rating, communication_rating, price_rating, comment) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [client_id, rating, service_rating, communication_rating, price_rating, comment]
        );
        return result.insertId;
    }    

    // Obtenir tous les avis
    static async getAllAvis() {
        const [rows] = await pool.query(`
            SELECT 
                a.*, 
                CONCAT(c.prenom, ' ', c.nom) AS user_name, 
                c.photo_de_profil AS user_avatar 
            FROM avis_ServiGO a 
            JOIN clients c ON a.client_id = c.id 
            ORDER BY a.date DESC
        `);
        return rows;
    }
    

    // Obtenir les statistiques globales
    static async getStats() {
        const [rows] = await pool.query(`
            SELECT 
                AVG(rating) as moyenne_rating,
                AVG(service_rating) as moyenne_service,
                AVG(communication_rating) as moyenne_communication,
                AVG(price_rating) as moyenne_prix,
                COUNT(*) as total_avis,
                (COUNT(CASE WHEN rating >= 4 THEN 1 END) * 100.0 / COUNT(*)) as pourcentage_satisfaction_rating,
                (COUNT(CASE WHEN service_rating >= 4 THEN 1 END) * 100.0 / COUNT(*)) as pourcentage_satisfaction_service,
                (COUNT(CASE WHEN communication_rating >= 4 THEN 1 END) * 100.0 / COUNT(*)) as pourcentage_satisfaction_communication,
                (COUNT(CASE WHEN price_rating >= 4 THEN 1 END) * 100.0 / COUNT(*)) as pourcentage_satisfaction_prix
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