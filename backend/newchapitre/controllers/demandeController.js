const Demande = require("../models/demandeModel");
const Prestataire = require("../models/prestataireModel");
exports.creerDemande = async (req, res) => {
  try {
      const { prestataire_id } = req.body;

      const prestataire = await Prestataire.findById(prestataire_id);
      if (!prestataire) {
          return res.status(404).json({ message: "Prestataire non trouvé" });
      }
      if (prestataire.statuts === 'active') {
          return res.status(400).json({ message: "Vous ne pouvez pas envoyer une demande si votre compte est déjà actif" });
      }

      const nouvelleDemandeId = await Demande.create({ prestataire_id });
      res.status(201).json({ message: "Demande envoyée", demande_id: nouvelleDemandeId });
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllDemandes = async (req, res) => {
    try {
        const demandes = await Demande.findAll();
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getDemandesByStatut = async (req, res) => {
    try {
        const { statut } = req.params;
        const demandes = await Demande.findByStatut(statut);
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getDemandesByPrestataire = async (req, res) => {
    try {
        const { prestataire_id } = req.params;
        const demandes = await Demande.findByPrestataire(prestataire_id);
        res.json(demandes);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getDemandesByPrestataireName = async (req, res) => {
  try {
      const { nom, prenom } = req.query;

      if (!nom && !prenom) {
          return res.status(400).json({ message: "Veuillez fournir un nom ou un prénom." });
      }

      const demandes = await Demande.findByPrestataireName(nom, prenom);
      
      if (!demandes.length) {
          return res.status(404).json({ message: "Aucune demande trouvée pour ce prestataire." });
      }

      res.json(demandes);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.updateStatutDemande = async (req, res) => {
  try {
    const { id } = req.params; // ID de la demande
    const { statut } = req.body; // Le statut doit être dans le body
     
    if (!["Accepté", "Refusé"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // Mettre à jour la demande de validation
    const updatedRows = await Demande.updateStatus(id, statut);
    if (updatedRows === 0) {
        return res.status(404).json({ message: "Demande non trouvée" });
    }

    // Récupérer le prestataire lié à la demande
    const demande = await Demande.findById(id);
    if (!demande) {
      return res.status(404).json({ message: "Demande introuvable" });
    }

    // Définir le statut du prestataire en fonction de la validation de la demande
    const prestataireStatus = (statut === "Accepté") ? "active" : "inactive";
    await Prestataire.updateStatus(demande.prestataire_id, prestataireStatus);

    res.json({ message: `Demande ${statut}, statut du prestataire mis à jour` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
//hadi ydirha client brk
exports.supprimerDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Demande.delete(id);
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Demande non trouvée" });
        }
        res.status(200).json({ message: "Demande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};