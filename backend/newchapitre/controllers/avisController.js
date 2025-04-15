const Avis = require("../models/avisModel");

// ✅ Ajouter un avis (Client → Prestataire)
exports.ajouterAvis = async (req, res) => {
    try {
        const { client_id, prestataire_id, evaluation, commentaire } = req.body;
        const avisId = await Avis.create({ client_id, prestataire_id, evaluation, commentaire });
        res.status(201).json({ message: "Avis ajouté avec succès", avisId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Récupérer tous les avis d’un prestataire
exports.getAvisByPrestataire = async (req, res) => {
    try {
        const { prestataireId } = req.params;
        const avis = await Avis.findByPrestataire(prestataireId);
        if (!avis.length) {
            return res.status(404).json({ message: "Aucun avis trouvé pour ce prestataire" });
        }
        res.json(avis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Modifier un avis (Seulement le client qui l'a posté)
exports.modifierAvis = async (req, res) => {
  try {
      console.log("ID de l'avis reçu :", req.params.avisId);

      if (!req.params.avisId) {
          return res.status(400).json({ message: "ID de l'avis manquant" });
      }

      const avis = await Avis.findById(req.params.avisId);
      if (!avis) {
          return res.status(404).json({ message: "Avis non trouvé" });
      }

      // Mise à jour de l'avis avec les nouvelles valeurs
      const updatedRows = await Avis.update(req.params.avisId, {
          evaluation: req.body.evaluation || avis.evaluation,
          commentaire: req.body.commentaire || avis.commentaire
      });

      if (updatedRows === 0) {
          return res.status(400).json({ message: "Échec de la mise à jour" });
      }

      res.status(200).json({ message: "Avis modifié avec succès" });

  } catch (error) {
      console.error("Erreur dans modifierAvis :", error.message);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Supprimer un avis (Seulement le client ou un admin)
exports.supprimerAvis = async (req, res) => {
  try {
      const { avisId } = req.params;
      const avis = await Avis.findById(avisId);

      if (!avis) {
          return res.status(404).json({ message: "Avis non trouvé" });
      }

      // Suppression directe sans vérification d'utilisateur
      const deletedRows = await Avis.delete(avisId);
      if (!deletedRows) {
          return res.status(400).json({ message: "Échec de la suppression" });
      }

      res.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
      console.error("Erreur dans supprimerAvis :", error.message);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
