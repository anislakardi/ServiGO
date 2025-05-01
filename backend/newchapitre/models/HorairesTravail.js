const db = require("../config/database");

class HorairesTravail {
  static async getHorairesByPrestataire(prestataireId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM horaires_travail WHERE prestataire_id = ? ORDER BY FIELD(jour_semaine, "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche")',
        [prestataireId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async updateHoraires(prestataireId, horaires) {
    try {
      // Supprimer les anciens horaires
      await db.query('DELETE FROM horaires_travail WHERE prestataire_id = ?', [prestataireId]);

      // Insérer les nouveaux horaires
      const values = horaires.map(horaire => [
        prestataireId,
        horaire.jour_semaine,
        horaire.ferme ? null : horaire.heure_debut,
        horaire.ferme ? null : horaire.heure_fin,
        horaire.ferme
      ]);

      await db.query(
        'INSERT INTO horaires_travail (prestataire_id, jour_semaine, heure_debut, heure_fin, ferme) VALUES ?',
        [values]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async createHoraires(prestataireId) {
    try {
      const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
      const values = joursSemaine.map(jour => [prestataireId, jour, null, null, true]);

      await db.query(
        'INSERT INTO horaires_travail (prestataire_id, jour_semaine, heure_debut, heure_fin, ferme) VALUES ?',
        [values]
      );

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HorairesTravail; 