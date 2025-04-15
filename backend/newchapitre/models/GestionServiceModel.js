const pool = require("../config/database");

class GestionServiceModel {
  static async createRequest(requestData) {
      requestData.details = JSON.stringify(requestData.details);
      return pool.query("INSERT INTO gestiondes_services SET ?", [requestData]);
  }

  static async createModificationRequest(requestData) {
    // Vérifier si service_id est fourni
    if (!requestData.service_id) {
        throw new Error("L'ID du service est requis pour une modification.");
    }

    // Récupérer les informations du service existant
    const [rows] = await pool.query("SELECT * FROM services WHERE id = ?", [requestData.service_id]);

    if (rows.length === 0) {
        throw new Error("Le service demandé n'existe pas.");
    }

    const existingService = rows[0];

    // Compléter les données manquantes avec les valeurs du service existant
    requestData.prestataire_id = requestData.prestataire_id || existingService.prestataire_id;
    requestData.client_id = requestData.client_id || existingService.client_id;

    // Convertir `details` en JSON string
    requestData.details = JSON.stringify(requestData.details);

    // Insérer la demande de modification
    return pool.query("INSERT INTO gestiondes_services SET ?", [requestData]);
}

  static async getRequestById(id) {
      const [rows] = await pool.query("SELECT * FROM gestiondes_services WHERE id = ?", [id]);
      return rows[0];
  }

  static async updateRequest(id, updateData) {
      return pool.query("UPDATE gestiondes_services SET ? WHERE id = ?", [updateData, id]);
  }

  static async deletePendingRequest(id) {
      return pool.query("DELETE FROM gestiondes_services WHERE id = ? AND statut = 'En attente'", [id]);
  }

  static async getRequestsByUser(userId, userType) {
      const column = userType === "client" ? "client_id" : "prestataire_id";
      return pool.query(`SELECT * FROM gestiondes_services WHERE ${column} = ?`, [userId]);
  }

  static async getAllRequests() {
    const [rows] = await pool.query(`SELECT * FROM gestiondes_services`);
    return rows;
  }
  static async getRequestsById(id_request) {
        const [rows] = await pool.query(`SELECT * FROM gestiondes_services WHERE id = ?`, [id_request]);
        return rows;
  }
  static async getRequestsByIdUsers(id_user,typeOfUser) {
    let column = '';
    if (typeOfUser === "client") {
      column = 'client_id';
    } else if (typeOfUser === "prestataire") {
      column = 'prestataire_id';
    }
          const [rows] = await pool.query(`SELECT * FROM gestiondes_services WHERE ${column} = ?`, [id_user]);
          return rows;
  }
}

module.exports = GestionServiceModel;