const Prestataire = require('../models/prestataireModel');
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // Assure-toi que le chemin est correct

exports.createPrestataire = async (req, res) => {
  try {
      const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience } = req.body;

      // Vérifier si l'email existe déjà
      const [rows] = await pool.query('SELECT * FROM prestataires WHERE email = ?', [email]);

      if (rows.length > 0) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Insérer un nouveau Prestataire
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    await pool.query(
        `INSERT INTO prestataires (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe, specialisation, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        [nom_utilisateur, nom, prenom, date_nee, adresse, email, hashedPassword, specialisation, experience]
    );

      res.status(201).json({ message: 'Prestataire créé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du Prestataire', error });
  }
};

exports.getAllPrestataires = async (req, res) => {
    try {
        const prestataires = await Prestataire.findAll();
        res.status(200).json(prestataires);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getPrestataireById = async (req, res) => {
    try {
        const prestataires = await Prestataire.findById(req.params.id);
        if (!prestataires) return res.status(404).json({ message: "Prestataire non trouvé" });
        res.status(200).json(prestataires);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.updatePrestataire = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Vérifier si le Prestataire existe
        const existingPrestataire = await Prestataire.findById(id);
        if (!existingPrestataire) {
            return res.status(404).json({ message: "Prestataire non trouvé" });
        }

        // Construire dynamiquement la requête SQL en fonction des champs fournis
        const fields = Object.keys(updates);
        if (fields.length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        const values = fields.map(field => updates[field]);
        const setClause = fields.map(field => `${field} = ?`).join(", ");

        // Exécuter la requête de mise à jour
        await pool.query(`UPDATE prestataires SET ${setClause} WHERE id = ?`, [...values, id]);

        res.status(200).json({ message: "Prestataire mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.supprimerPrestataire = async (req, res) => {
    try {
        const deleted = await Prestataire.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Prestataire non trouvé" });
        res.status(200).json({ message: "Prestataire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.desactiverPrestataire = async (req, res) => {
    try {
        const { id } = req.params;

        const prestataire = await Prestataire.findById(id);
        if (!prestataire) {
            return res.status(404).json({ message: "Prestataire non trouvé" });
        }

        await Prestataire.updateStatus(id, 'inactive');

        res.json({ message: "Prestataire désactivé. Il doit refaire une demande de validation." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
