const Signalement = require("../models/signalementModel");

exports.getAllSignalements = async (req, res) => {
  try {
    const signalements = await Signalement.getAll();
    res.status(200).json(signalements);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getSignalementsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const signalements = await Signalement.getByType(type);
    if (signalements.length === 0) {
      return res.status(404).json({ message: "Aucun signalement trouvé pour ce type" });
    }
    res.status(200).json(signalements);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getSignalementById = async (req, res) => {
  try {
    const { id } = req.params;
    const signalement = await Signalement.getById(id);
    if (!signalement) {
      return res.status(404).json({ message: "Signalement non trouvé" });
    }
    res.status(200).json(signalement);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.createSignalement = async (req, res) => {
  try {
    const { type, id_objet, description, date_signalement } = req.body;

    // Validation des données (facultatif, tu peux ajouter une validation avec Joi ou une autre méthode)
    if (!type || !id_objet || !description || !date_signalement) {
      return res.status(400).json({ message: "Tous les champs sont nécessaires" });
    }

    const result = await Signalement.create({ type, id_objet, description, date_signalement });
    res.status(201).json({ message: "Signalement créé", id: result.id });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

exports.updateStatutSignalement = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!["En attente", "Résolu", "Non résolu"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updated = await Signalement.updateStatut(id, statut);
    if (!updated) {
      return res.status(404).json({ message: "Signalement non trouvé" });
    }

    res.status(200).json({ message: "Statut mis à jour" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.deleteSignalement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Signalement.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Signalement non trouvé" });
    }
    res.status(200).json({ message: "Signalement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
