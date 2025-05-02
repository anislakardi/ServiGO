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
  static async getRequestsByIdUsers(id_user, typeOfUser) {
    const column = typeOfUser === 'prestataire'
                 ? 'prestataire_id'
                 : 'client_id';
  
    const [rows] = await pool.query(`
      SELECT
        gs.id                AS request_id,
        gs.prestataire_id,
        gs.client_id,
        gs.type_demande,                       -- création / modification
        gs.details           AS details_json,
        gs.statut            AS request_statut,
        gs.date_demande,
        p.nom                AS prest_nom,     -- nom du prestataire
        p.prenom             AS prest_prenom,
        s.titre,
        s.description,
        s.prix,
        s.categorie,
        s.statut_travail,
        s.date_creation      AS service_creation,
        s.date_prevue,
        s.date_execution,
        s.date_fin
      FROM gestiondes_services gs
      LEFT JOIN services s
        ON gs.service_id = s.id
      LEFT JOIN prestataires p
        ON gs.prestataire_id = p.id
      WHERE gs.${column} = ?
        AND gs.statut = 'En attente'
    `, [id_user]);
  
    return rows.map(r => {
      // 1er parse : extrait la chaîne JSON
      let details = JSON.parse(r.details_json || '{}');
    
      // si le résultat est encore une string (double‑encodage), on re‑parse
      if (typeof details === 'string') {
        try {
          details = JSON.parse(details);
        } catch (e) {
          console.warn('Impossible de re‑parser details JSON :', e);
          details = {};
        }
      }
    
      return {
        request_id:     r.request_id,
        prestataire:    `${r.prest_nom} ${r.prest_prenom}`,
        type_demande:   r.type_demande,
        request_statut: r.request_statut,
        date_demande:   r.date_demande,
    
        // maintenant details est bien un objet
        titre:          details.titre         ?? r.titre,
        description:    details.description   ?? r.description,
        prix:           details.prix          ?? r.prix,
        categorie:      details.categorie     ?? r.categorie,
        statut_travail: details.statut_travail ?? r.statut_travail,
    
        date_creation:  r.service_creation,
        date_prevue:    details.date_prevue   ?? r.date_prevue,
        date_execution: r.date_execution,
        date_fin:       r.date_fin
      };
    });
  }
  
}

module.exports = GestionServiceModel;