const ServiceModel = require("../models/ServiceModel");
const GestionServiceModel = require("../models/GestionServiceModel");

class ServiceController {
    static async createServiceRequest(req, res) {
        const requestData = req.body;
        await GestionServiceModel.createRequest(requestData);
        res.status(201).json({ message: "Demande créée avec succès" });
    }
    static async createModificationRequest(req, res) {
        const modificationData = req.body;
        await GestionServiceModel.createModificationRequest(modificationData);
        res.status(201).json({ message: "Demande de modification créée avec succès" });
    }

    static async approveOrRejectRequest(req, res) {
        const { id } = req.params;
        const { decision } = req.body; // "accepté" ou "refusé"
    
        const request = await GestionServiceModel.getRequestById(id);
        if (!request) return res.status(404).json({ error: "Demande introuvable" });
    
        if (decision === "accepté") {
            // Récupérer l'ancien service
            const existingService = await ServiceModel.getServicesById(request.service_id);
            if (!existingService) return res.status(404).json({ error: "Service introuvable" });
    
            const details = JSON.parse(request.details);
    
            // Construire l'objet de mise à jour
            const updateData = {};
            if (details.statut_travail) {
                updateData.statut_travail = details.statut_travail;
                if (details.statut_travail === "En cours") {
                    updateData.date_execution = new Date(); // Date actuelle
                } else if (details.statut_travail === "Terminé") {
                    updateData.date_fin = new Date();
                    console.log(updateData.date_fin);
                }
            }
    
            // Mettre à jour le service
            await ServiceModel.updateService(request.service_id, updateData);
    
            // Mettre à jour le statut de la demande
            await GestionServiceModel.deletePendingRequest(id);
    
            return res.json({ message: "Demande approuvée et mise à jour du service effectuée" });
        } else if (decision === "refusé") {
            await GestionServiceModel.deletePendingRequest(id);
            return res.json({ message: "Demande refusée" });
        }
    
        res.status(400).json({ error: "Décision invalide" });
    
    }    

    static async deletePendingRequest(req, res) {
        const { id } = req.params;
        await GestionServiceModel.deletePendingRequest(id);
        res.json({ message: "Demande supprimée" });
    }


    // get services
    static async getAllServices(req, res) {
        const services = await ServiceModel.getAllServices();
        res.json(services);
    }
    static async getServicesById(req, res) {
        const { id: id_service } = req.params;
        const services = await ServiceModel.getServicesById(id_service);
        res.json(services);
    }
    static async getServicesByIdUsers(req, res) {
        const { id: id_user } = req.params;
        const { typeOfUser } = req.body;
        const services = await ServiceModel.getServicesByIdUsers(id_user,typeOfUser);
        res.json(services);
    }

    static async getPrestatairesByClient(req, res) {
        const { id: clientId } = req.params;
        try {
            const prestataires = await ServiceModel.getPrestataireDetailsByClient(clientId);
            res.json(prestataires);
        } catch (error) {
            console.error("Erreur lors de la récupération des prestataires :", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    


    // get Requests
    static async getAllRequests(req, res) {
        const requests = await GestionServiceModel.getAllRequests();
        res.json(requests);
    }
    static async getRequestsById(req, res) {
        const { id: id_request } = req.params;
        const requests = await GestionServiceModel.getRequestsById(id_request);
        res.json(requests);
    }
    static async getRequestsByIdUsers(req, res) {
        const { id: id_user } = req.params;
        const { typeOfUser } = req.body;
        const requests = await GestionServiceModel.getRequestsByIdUsers(id_user,typeOfUser);
        res.json(requests);
    }
}

module.exports = ServiceController;