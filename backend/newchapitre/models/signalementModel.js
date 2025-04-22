const pool = require("../config/database");

class Signalement {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM signalements");
    return rows;
  }

  static async getByType(type) {
    const [rows] = await pool.query("SELECT * FROM signalements WHERE type = ?", [type]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM signalements WHERE id = ?", [id]);
    return rows[0];
  }

  static async create({ type, id_objet, description, date_signalement }) {
    const [result] = await pool.query(
      "INSERT INTO signalements (type, id_objet, description, date_signalement) VALUES (?, ?, ?, ?)",
      [type, id_objet, description, date_signalement]
    );
    return { id: result.insertId };
  }

  static async updateStatut(id, statut) {
    const [result] = await pool.query(
      "UPDATE signalements SET statut = ? WHERE id = ?",
      [statut, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query("DELETE FROM signalements WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Signalement;
