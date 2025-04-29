const pool = require('../config/database');

class Prestataire {
    static async create({ nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience }) {
        const [result] = await pool.query(
            `INSERT INTO prestataires (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience]
        );
        return result.insertId;
    }

    static async findAll() {
      const [rows] = await pool.query(`SELECT * FROM prestataires`);
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM prestataires WHERE id = ?`, [id]);
        return rows[0];
    }

    static async update(id, data) {
        const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience } = data;
        const [result] = await pool.query(
            `UPDATE prestataires SET nom_utilisateur = ?, nom = ?, prenom = ?, date_nee = ?, adresse = ?, email = ?, mot_de_passe = ?, specialisation = ?, experience = ? WHERE id = ?`,
            [nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, id, specialisation, experience]
        );
        return result.affectedRows;
    }

    static async suspend(id, dateSuspension) {
            const [result] = await pool.query(`UPDATE prestataires SET suspendu_jusqu = ? WHERE id = ?`, [dateSuspension, id]);
            return result.affectedRows;
        }
    
    static async activate(id) {
        const [result] = await pool.query(`UPDATE prestataires SET suspendu_jusqu = NULL WHERE id = ?`, [id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query(`DELETE FROM prestataires WHERE id = ?`, [id]);
        return result.affectedRows;
    }

    static async updateStatus(id, status) {
        const [result] = await pool.query(
            "UPDATE prestataires SET statuts = ? WHERE id = ?",
            [status, id]
        );
        return result.affectedRows;
    }    
}

module.exports = Prestataire;
