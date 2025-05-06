const Commentaire = require("../models/commentaireModel");

// Ajouter un commentaire à une publication
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { publication_id, client_id, texte, commentaire_parent_id } = req.body;
    const commentaireId = await Commentaire.create({ publication_id, client_id, texte, commentaire_parent_id });
    res.status(201).json({ message: "Commentaire ajouté avec succès", commentaireId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les commentaires d’une publication
exports.getCommentairesByPublication = async (req, res) => {
  try {
    const { publicationId } = req.params;
    const commentaires = await Commentaire.findByPublication(publicationId);
    if (!commentaires.length) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour cette publication" });
    }
    res.json(commentaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un commentaire (auteur uniquement)
exports.modifierCommentaire = async (req, res) => {
  try {
    const { commentaireId } = req.params;
    const commentaire = await Commentaire.findById(commentaireId);
    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    const updatedRows = await Commentaire.update(commentaireId, {
      texte: req.body.texte || commentaire.texte
    });
    if (!updatedRows) {
      return res.status(400).json({ message: "Échec de la mise à jour" });
    }
    res.status(200).json({ message: "Commentaire modifié avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un commentaire (auteur ou admin)
exports.supprimerCommentaire = async (req, res) => {
  try {
    const { commentaireId } = req.params;
    const commentaire = await Commentaire.findById(commentaireId);
    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    const deletedRows = await Commentaire.delete(commentaireId);
    if (!deletedRows) {
      return res.status(400).json({ message: "Échec de la suppression" });
    }
    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
