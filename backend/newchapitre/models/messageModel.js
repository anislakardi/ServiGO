const pool = require("../config/database");

class Message {
    static async create({ conversation_id, sender_client_id, sender_prestataire_id, description, photos }) {
        const [result] = await pool.query(
            `INSERT INTO messages (conversation_id, sender_client_id, sender_prestataire_id, description, date_message, status, photos) 
             VALUES (?, ?, ?, ?, NOW(), 'envoyé', ?)`,
            [conversation_id, sender_client_id || null, sender_prestataire_id || null, description, photos]
        );
        return result.insertId;
    }

    static async findByConversation(conversation_id) {
        const [rows] = await pool.query(
            `SELECT * FROM messages WHERE conversation_id = ? ORDER BY date_message ASC`,
            [conversation_id]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM messages WHERE id = ?`, [id]);
        return rows[0];
    }

    static async markAsRead(id) {
        const [result] = await pool.query(
            `UPDATE messages SET status = 'lu' WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM messages WHERE id = ?`, [id]);
        return result.affectedRows;
    }
}

module.exports = Message;
