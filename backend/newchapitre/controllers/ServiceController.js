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
        const { decision } = req.body;
    
        try {
          const request = await GestionServiceModel.getRequestById(id);
          if (!request) return res.status(404).json({ error: "Demande introuvable" });
    
          const decisionValue = decision.toLowerCase();
          if (decisionValue !== "accepté" && decisionValue !== "refusé") {
            return res.status(400).json({ error: "Décision invalide" });
          }
    
          if (decisionValue === "refusé") {
            await GestionServiceModel.deletePendingRequest(id);
            return res.json({ message: "Demande refusée." });
          }
    
          // Accepté : on crée ou modifie suivant type_demande
          let details;
          try {
            details = JSON.parse(request.details);
            if (typeof details === 'string') {
              details = JSON.parse(details);
            }
          } catch (parseErr) {
            console.error("Erreur parsing details :", parseErr);
            return res.status(400).json({ error: "Détails invalides" });
          }
    
          if (request.type_demande === "création") {
            // Création
            const newService = {
              prestataire_id: request.prestataire_id,
              client_id:      request.client_id,
              titre:          details.titre,
              description:    details.description || null,
              prix:           details.prix || null,
              categorie:      details.categorie,
              statut_travail: details.statut_travail || 'À faire',
              date_creation:  details.date_creation   ? new Date(details.date_creation)   : new Date(),
              date_prevue:    details.date_prevue     ? new Date(details.date_prevue)     : null,
              date_execution: details.date_execution  ? new Date(details.date_execution)  : null,
              date_fin:       details.date_fin        ? new Date(details.date_fin)        : null
            };
            console.log("Création - newService :", newService);
            await ServiceModel.insertService(newService);
          } else {
            // Modification
            const updatedFields = {
              titre:          details.titre,
              description:    details.description,
              prix:           details.prix,
              categorie:      details.categorie,
              statut_travail: details.statut_travail
            };
            if (details.date_prevue)    updatedFields.date_prevue    = new Date(details.date_prevue);
            if (details.statut_travail === "En cours") updatedFields.date_execution = new Date();
            if (details.statut_travail === "Terminé") updatedFields.date_fin       = new Date();
    
            console.log("Modification - updatedFields :", updatedFields);
            const result = await ServiceModel.updateService(request.service_id, updatedFields);
            console.log("Résultat SQL :", result);
          }
    
          await GestionServiceModel.deletePendingRequest(id);
          return res.json({ message: "Demande approuvée et traitée avec succès." });
    
        } catch (err) {
          console.error("Erreur dans approveOrRejectRequest :", err);
          return res.status(500).json({ error: "Erreur serveur" });
        }
      }
        // ... autres méthodes du controller restent inchangées ...

      
          

    static async deletePendingRequest(req, res) {
        const { id } = req.params;
        await GestionServiceModel.deletePendingRequest(id);
        res.json({ message: "Demande supprimée" });
    }
    static async deleteService(req, res) {
        const { id } = req.params;
        await ServiceModel.deleteService(id);
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
    // ServiceController.js
static async getRequestsByIdUsers(req, res) {
    const { id: id_user } = req.params;
    const { typeOfUser }  = req.query;    // <— ici!
    try {
      const requests = await GestionServiceModel.getRequestsByIdUsers(id_user, typeOfUser);
      res.json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
  
}

module.exports = ServiceController;