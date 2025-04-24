const pool = require("../config/database");

class Avis {
    static async create({ client_id, prestataire_id, evaluation, commentaire }) {
        const [result] = await pool.query(
            `INSERT INTO avis (client_id, prestataire_id, evaluation, commentaire) VALUES (?, ?, ?, ?)`,
            [client_id, prestataire_id, evaluation, commentaire]
        );
        return result.insertId;
    }

    static async findByPrestataire(prestataire_id) {
        const [rows] = await pool.query(
            `SELECT a.*, c.nom AS client_nom, c.email AS client_email 
             FROM avis a 
             JOIN clients c ON a.client_id = c.id 
             WHERE a.prestataire_id = ?`,
            [prestataire_id]
        );
        return rows;
    }
    static async getAverageEvaluation(prestataire_id) {
        const [rows] = await pool.query(
            `SELECT AVG(evaluation) AS moyenne FROM avis WHERE prestataire_id = ?`,
            [prestataire_id]
        );
        return rows[0].moyenne;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM avis WHERE id = ?`, [id]);
        return rows[0];
    }

    static async update(id, { evaluation, commentaire }) {
        const [result] = await pool.query(
            `UPDATE avis SET evaluation = ?, commentaire = ? WHERE id = ?`,
            [evaluation, commentaire, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM avis WHERE id = ?`, [id]);
        return result.affectedRows;
    }
}

module.exports = Avis;
