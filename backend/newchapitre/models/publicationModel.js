const pool = require("../config/database");

class Publication {
    static async create({ titre, description, adresse, date_execution, service_vise, client_id, media }) {
        const [result] = await pool.query(
            `INSERT INTO client_publication (titre, description, adresse, date_execution, service_vise, client_id, media) VALUES (?, ?, ?, ?, ?, ?)`,
            [titre, description, adresse, date_execution, service_vise, client_id, media]
        );
        return result.insertId;
    }

    static async findById(id) {
      const [rows] = await pool.query("SELECT * FROM client_publication WHERE id = ?", [id]);
      return rows.length > 0 ? rows[0] : null;
    }
  
    static async findAll() {
        const [rows] = await pool.query("SELECT * FROM client_publication");
        return rows;
    }

    static async findByService(service_vise) {
        const [rows] = await pool.query("SELECT * FROM client_publication WHERE service_vise = ?", [service_vise]);
        return rows;
    }
    static async findByStatus(status) {
      const [rows] = await pool.query(`SELECT * FROM client_publication WHERE statut = ?`, [status]);
      return rows;
    }
    static async findByIdClient(client_id) {
      const [rows] = await pool.query("SELECT * FROM client_publication WHERE client_id = ?", [client_id]);
      return rows;
    }  

    static async update(id, { titre, description, adresse, date_execution, statut }) {
        const [result] = await pool.query(
            `UPDATE client_publication SET titre = ?, description = ?, adresse = ?, date_execution = ?, statut = ? WHERE id = ?`,
            [titre, description, adresse, date_execution, statut, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query("DELETE FROM client_publication WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Publication;
