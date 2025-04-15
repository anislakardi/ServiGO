const pool = require("../config/database");

class ServiceModel {
    static async createService(serviceData) {
        const details = JSON.parse(serviceData.details);
    
        if (serviceData.type_demande === "modification") {
            // Vérifier si le service existe
            const [rows] = await pool.query("SELECT * FROM services WHERE id = ?", [serviceData.service_id]);
    
            if (rows.length === 0) {
                throw new Error("Service à modifier introuvable.");
            }
    
            const existingService = rows[0]; // Données actuelles du service
    
            // Mise à jour en conservant les anciennes valeurs si elles ne sont pas fournies
            const updatedService = {
                titre: details.titre ?? existingService.titre,
                description: details.description ?? existingService.description,
                prix: details.prix ?? existingService.prix,
                categorie: details.categorie ?? existingService.categorie,
                statut_travail: details.statut_travail ?? existingService.statut_travail,
                date_prevue: details.date_prevue ?? existingService.date_prevue,
            };
    
            await pool.query("UPDATE services SET ? WHERE id = ?", [updatedService, serviceData.service_id]);
    
            return { message: "Service mis à jour avec succès." };
    
        } else {
            // Création d'un nouveau service
            const newService = {
                prestataire_id: serviceData.prestataire_id,
                client_id: serviceData.client_id,
                titre: details.titre,
                description: details.description || null,
                prix: details.prix || null,
                categorie: details.categorie,
                statut_travail: details.statut_travail || 'À faire',
                date_prevue: details.date_prevue || null,
            };
    
            await pool.query("INSERT INTO services SET ?", [newService]);
    
            return { message: "Service ajouté avec succès." };
        }
    
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
    let column = '';
    if (typeOfUser === "client") {
        column = 'client_id';
    } else if (typeOfUser === "prestataire") {
        column = 'prestataire_id';
    }
        const [rows] = await pool.query(`SELECT * FROM services WHERE ${column} = ?`, [id_user]);
        return rows;
    }
    static async updateService(serviceId, updateData) {
        return pool.query("UPDATE services SET ? WHERE id = ?", [updateData, serviceId]);
    }
    
}

module.exports = ServiceModel;