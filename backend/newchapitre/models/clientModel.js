const pool = require('../config/database');

class Client {
    static async create({ nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe }) {
        const [result] = await pool.query(
            `INSERT INTO client (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe]
        );
        return result.insertId;
    }

    static async findAll() {
      const [rows] = await pool.query(`SELECT * FROM clients`);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM clients WHERE id = ?`, [id]);
        return rows[0];
    }
    static async findByUsername(username) {
        const [rows] = await pool.query(
          `SELECT id FROM clients WHERE nom_utilisateur = ?`,
          [username]
        );
        return rows[0] || null;
      }

    static async update(id, data) {
        const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, bio} = data;
        const [result] = await pool.query(
            `UPDATE clients SET nom_utilisateur = ?, nom = ?, prenom = ?, date_nee = ?, adresse = ?, email = ?, mot_de_passe = ?, bio = ? WHERE id = ?`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, bio, id]
        );
        return result.affectedRows;
    }

    static async suspend(id, dateSuspension) {
        const [result] = await pool.query(`UPDATE clients SET suspendu_jusqu = ? WHERE id = ?`, [dateSuspension, id]);
        return result.affectedRows;
    }

    static async activate(id) {
        const [result] = await pool.query(`UPDATE clients SET suspendu_jusqu = NULL WHERE id = ?`, [id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM clients WHERE id = ?`, [id]);
        return result.affectedRows;
    }
}

module.exports = Client;
