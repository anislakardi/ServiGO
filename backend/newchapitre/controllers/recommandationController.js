const Recommandation = require("../models/recommandationModel");

exports.createRecommandation = async (req, res) => {
  try {
    const { id_recommandeur, id_publication, id_profil_recommande, commentaire } = req.body;
    // Vérifier que la recommandation est valide
    const serviceTermine = await Recommandation.hasCompletedService(id_recommandeur, id_profil_recommande);
    if (!serviceTermine) {
      return res.status(403).json({ message: "Impossible de recommander ce profil. Le service n'est pas terminé ou inexistant." });
    }

    const result = await Recommandation.create({ id_recommandeur, id_publication, id_profil_recommande, commentaire });
    res.status(201).json({ message: "Recommandation ajoutée", id: result.id });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getRecommandationsByPublication = async (req, res) => {
  try {
    const { id_publication } = req.params;
    const recommandations = await Recommandation.getByPublication(id_publication);
    res.status(200).json(recommandations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
