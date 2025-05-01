const pool = require('../config/database');

class Notification {
    static async create(notification) {
        const [result] = await pool.query(
            `INSERT INTO notifications (prestataire_id, type, titre, description, lien) 
             VALUES (?, ?, ?, ?, ?)`,
            [notification.prestataire_id, notification.type, notification.titre, 
             notification.description, notification.lien]
        );
        return result.insertId;
    }

    static async findByPrestataireId(prestataireId) {
        const [rows] = await pool.query(
            `SELECT * FROM notifications 
             WHERE prestataire_id = ? 
             ORDER BY date_creation DESC`,
            [prestataireId]
        );
        return rows;
    }

    static async markAsRead(notificationId) {
        const [result] = await pool.query(
            `UPDATE notifications 
             SET est_lu = TRUE 
             WHERE id = ?`,
            [notificationId]
        );
        return result.affectedRows;
    }

    static async markAllAsRead(prestataireId) {
        const [result] = await pool.query(
            `UPDATE notifications 
             SET est_lu = TRUE 
             WHERE prestataire_id = ? AND est_lu = FALSE`,
            [prestataireId]
        );
        return result.affectedRows;
    }

    static async getUnreadCount(prestataireId) {
        const [rows] = await pool.query(
            `SELECT COUNT(*) as count 
             FROM notifications 
             WHERE prestataire_id = ? AND est_lu = FALSE`,
            [prestataireId]
        );
        return rows[0].count;
    }

    static async delete(notificationId) {
        const [result] = await pool.query(
            `DELETE FROM notifications 
             WHERE id = ?`,
            [notificationId]
        );
        return result.affectedRows;
    }
}

module.exports = Notification; 