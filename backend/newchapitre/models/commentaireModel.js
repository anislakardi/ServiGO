const pool = require("../config/database");

class Commentaire {
  static async create({ publication_id, client_id, texte, commentaire_parent_id }) {
    const [result] = await pool.query(
      `INSERT INTO commentaire (publication_id, client_id, texte, commentaire_parent_id) VALUES (?, ?, ?, ?)`,
      [publication_id, client_id, texte, commentaire_parent_id || null]
    );
    return result.insertId;
  }

  static async findByPublication(publication_id) {
    const [rows] = await pool.query(
      `SELECT c.*, cl.nom_utilisateur AS client_nom, cl.email AS client_email
       FROM commentaire c
       JOIN clients cl ON c.client_id = cl.id
       WHERE c.publication_id = ?
       ORDER BY c.created_at ASC`,
      [publication_id]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM commentaire WHERE commentaire_id = ?`, [id]);
    return rows[0];
  }

  static async update(id, { texte }) {
    const [result] = await pool.query(
      `UPDATE commentaire SET texte = ? WHERE commentaire_id = ?`,
      [texte, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.query(`DELETE FROM commentaire WHERE commentaire_id = ?`, [id]);
    return result.affectedRows;
  }
}

module.exports = Commentaire;