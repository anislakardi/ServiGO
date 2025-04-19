const pool = require("../config/database");

class Conversation {
    static async create({ client_id, prestataire_id, titre }) {
        const [result] = await pool.query(
            `INSERT INTO conversations (client_id, prestataire_id, titre) VALUES (?, ?, ?)`,
            [client_id, prestataire_id, titre]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM conversations WHERE id = ?`, [id]);
        return rows[0];
    }

    static async findByClient(client_id) {
        const [rows] = await pool.query(
            `SELECT * FROM conversations WHERE client_id = ?`, 
            [client_id]
        );
        return rows;
    }

    static async findByPrestataire(prestataire_id) {
        const [rows] = await pool.query(
            `SELECT * FROM conversations WHERE prestataire_id = ?`, 
            [prestataire_id]
        );
        return rows;
    }

    static async updateTitle(id, titre) {
        const [result] = await pool.query(
            `UPDATE conversations SET titre = ? WHERE id = ?`, 
            [titre, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM conversations WHERE id = ?`, [id]);
        return result.affectedRows;
    }
    static async findExisting(client_id, prestataire_id) {
        const [rows] = await pool.query(
            `SELECT * FROM conversations WHERE client_id = ? AND prestataire_id = ? LIMIT 1`,
            [client_id, prestataire_id]
        );
        return rows.length > 0 ? rows[0] : null;
    }
    static async isParticipant(conversation_id, user_id) {
        const [rows] = await pool.query(
            `SELECT * FROM conversations 
             WHERE id = ? AND (client_id = ? OR prestataire_id = ?)`,
            [conversation_id, user_id, user_id]
        );

        console.log("Résultat de la vérification :", rows); // 🔍 Debug

        return rows.length > 0;
    }    
    
    static async getConversationsWithPublications(client_id) {
        console.log("Récupération des conversations avec publications pour le client:", client_id);
        
        // Note: Pour optimiser les performances, assurez-vous d'avoir des index sur:
        // - conversations.client_id
        // - client_publication.client_id
        
        const [conversations] = await pool.query(
            `SELECT c.*, p.id as publication_id, p.titre as publication_titre, 
             p.description as publication_description, p.date_execution, p.service_vise, p.budget
             FROM conversations c
             LEFT JOIN client_publication p ON c.client_id = p.client_id
             WHERE c.client_id = ?
             ORDER BY c.id DESC`,
            [client_id]
        );
        
        return conversations;
    }
}

module.exports = Conversation;