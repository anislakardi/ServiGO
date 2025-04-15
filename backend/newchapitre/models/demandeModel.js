const pool = require("../config/database");

class Demande {
    static async create({ prestataire_id }) {
      const [result] = await pool.query(
          `INSERT INTO demande_validation (prestataire_id, date_demande, statut) VALUES (?, NOW(), 'En cours')`,
          [prestataire_id]
      );
      return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query("SELECT * FROM demande_validation");
        return rows;
    }

    static async findByStatut(statut) {
        const [rows] = await pool.query("SELECT * FROM demande_validation WHERE statut = ?", [statut]);
        return rows;
    }

    static async findByPrestataire(prestataire_id) {
        const [rows] = await pool.query("SELECT * FROM demande_validation WHERE prestataire_id = ?", [prestataire_id]);
        return rows;
    }

    static async updateStatus(id, statut) {
      const [result] = await pool.query(
          "UPDATE demande_validation SET statut = ? WHERE id = ?",
          [statut, id]
      );
      return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query("DELETE FROM demande_validation WHERE id = ?", [id]);
        return result.affectedRows;
    }

    static async findByPrestataireName(nom, prenom) {
      let query = `
          SELECT d.*
          FROM demande_validation d
          JOIN prestataires p ON d.prestataire_id = p.id
          WHERE 1=1
      `;
      const params = [];
  
      if (nom) {
          query += " AND p.nom LIKE ?";
          params.push(`%${nom}%`);
      }
      if (prenom) {
          query += " AND p.prenom LIKE ?";
          params.push(`%${prenom}%`);
      }
  
      const [rows] = await pool.query(query, params);
      return rows;
  }

  static async findById(id) {
  const [rows] = await pool.query("SELECT * FROM demande_validation WHERE id = ?", [id]);
  return rows.length ? rows[0] : null;
  }
}


module.exports = Demande;