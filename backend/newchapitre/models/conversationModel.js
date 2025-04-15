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
}

module.exports = Conversation;