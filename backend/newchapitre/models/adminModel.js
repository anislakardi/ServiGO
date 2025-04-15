const pool = require('../config/database');

class Admin {
    static async create({ nom, prenom, email, mot_de_passe, pin }) {
        const [result] = await pool.query(
            `INSERT INTO admins (nom, prenom, email, mot_de_passe, pin) VALUES (?, ?, ?, ?, ?)`,
            [nom, prenom, email, mot_de_passe, pin]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query(`SELECT * FROM admins`);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM admins WHERE id = ?`, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const { nom, prenom, email, mot_de_passe, pin } = data;
        const [result] = await pool.query(
            `UPDATE admins SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, pin = ? WHERE id = ?`,
            [nom, prenom, email, mot_de_passe, pin, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM admins WHERE id = ?`, [id]);
        return result.affectedRows;
    }
}

module.exports = Admin;
