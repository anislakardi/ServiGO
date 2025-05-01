const HorairesTravail = require('../models/HorairesTravail');

exports.getHoraires = async (req, res) => {
  try {
    const prestataireId = req.params.prestataireId;
    const horaires = await HorairesTravail.getHorairesByPrestataire(prestataireId);
    res.json(horaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des horaires' });
  }
};

exports.updateHoraires = async (req, res) => {
  try {
    const prestataireId = req.params.prestataireId;
    const horaires = req.body.horaires;

    // Validation des données
    if (!Array.isArray(horaires)) {
      return res.status(400).json({ message: 'Format de données invalide' });
    }

    // Vérifier que tous les jours sont présents
    const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const joursRecus = horaires.map(h => h.jour_semaine);
    const tousJoursPresents = joursSemaine.every(jour => joursRecus.includes(jour));

    if (!tousJoursPresents) {
      return res.status(400).json({ message: 'Tous les jours de la semaine doivent être spécifiés' });
    }

    await HorairesTravail.updateHoraires(prestataireId, horaires);
    res.json({ message: 'Horaires mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des horaires:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour des horaires' });
  }
};

exports.createHoraires = async (req, res) => {
  try {
    const prestataireId = req.params.prestataireId;
    await HorairesTravail.createHoraires(prestataireId);
    res.json({ message: 'Horaires créés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création des horaires:', error);
    res.status(500).json({ message: 'Erreur lors de la création des horaires' });
  }
}; 