const pool = require("../config/database");

class ServiceModel {
    static async insertService(data) {
        const fields = Object.keys(data).join(", ");
        // pool.query gère l'insertion par objet clef/valeur
        return pool.query("INSERT INTO services SET ?", [data]);
    }
    static async getAllServices() {
        const [rows] = await pool.query(`SELECT * FROM services`);
        return rows;
    }
    static async getServicesById(id_service) {
        const [rows] = await pool.query(`SELECT * FROM services WHERE id = ?`, [id_service]);
        return rows;
    }
    static async getServicesByIdUsers(id_user,typeOfUser) {
        const column = typeOfUser === 'prestataire'
        ? 'client_id'
        : 'prestataire_id';
        
        const [rows] = await pool.query(`SELECT * FROM services WHERE ${column} = ?`, [id_user]);
        return rows;
    }


    static async getPrestataireDetailsByClient(clientId) {
        const [rows] = await pool.query(`
            SELECT DISTINCT 
              u.id             AS prestataire_id,
              u.nom,
              u.prenom,
              u.adresse,
              u.specialisation
            FROM services s
            JOIN prestataires u 
              ON s.prestataire_id = u.id
            WHERE s.client_id       = ?
              AND s.statut_travail  = 'Terminé'
          `, [clientId]);
          
    
        return rows;
    }    

    
    static async updateService(serviceId, updateData) {
        const keys   = Object.keys(updateData);
        const values = Object.values(updateData);
        const setSQL = keys.map(col => `${col} = ?`).join(", ");
        const sql    = `UPDATE services SET ${setSQL} WHERE id = ?`;
        return pool.query(sql, [...values, serviceId]);
      }
    static async deleteService(id) {
          return pool.query("DELETE FROM services WHERE id = ? AND statut_travail = 'Terminé'", [id]);
      }

      static async calculateEstimatedRevenue(prestataireId) {
        try {
            // Récupérer tous les services terminés du prestataire
            const [rows] = await pool.query(
                `SELECT prix FROM services 
                WHERE prestataire_id = ? AND statut_travail = 'Terminé'`,
                [prestataireId]
            );
            
            // Calculer la somme des prix
            const totalRevenue = rows.reduce((sum, service) => sum + (service.prix || 0), 0);
            
            return totalRevenue;
        } catch (error) {
            console.error("Erreur lors du calcul des revenus estimés:", error);
            throw error;
        }
    }
      
    
    
}

module.exports = ServiceModel;