const pool = require("../config/database");

class Recommandation {
  static async create({ id_recommandeur, id_publication, id_profil_recommande, commentaire }) {
    const [result] = await pool.query(
      `INSERT INTO recommandations_profil 
      (id_recommandeur, id_publication, id_profil_recommande, commentaire) 
      VALUES (?, ?, ?, ?)`,
      [id_recommandeur, id_publication, id_profil_recommande, commentaire]
    );
    return { id: result.insertId };
  }

  static async getByPublication(id_publication) {
    const [rows] = await pool.query(
      `SELECT * FROM recommandations_profil WHERE id_publication = ?`,
      [id_publication]
    );
    return rows;
  }

  static async hasCompletedService(id_recommandeur, id_profil_recommande) {
    const [rows] = await pool.query(
      `SELECT * FROM services 
       WHERE client_id = ? 
       AND prestataire_id = ? 
       AND statut_travail = 'termine'`,
      [id_recommandeur, id_profil_recommande]
    );
    return rows.length > 0;
  }
}

module.exports = Recommandation;
