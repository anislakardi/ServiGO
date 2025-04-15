const Client = require('../models/clientModel');
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // Assure-toi que le chemin est correct

exports.createClient = async (req, res) => {
  try {
      const { nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe } = req.body;

      // Vérifier si l'email existe déjà
      const [rows] = await pool.query('SELECT * FROM clients WHERE email = ?', [email]);

      if (rows.length > 0) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Insérer un nouveau client
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    await pool.query(
        `INSERT INTO clients (nom_utilisateur, nom, prenom, date_nee, adresse, email, mot_de_passe) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [nom_utilisateur, nom, prenom, date_nee, adresse, email, hashedPassword]
    );

      res.status(201).json({ message: 'Client créé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création du client', error });
  }
};

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const clients = await Client.findById(req.params.id);
        if (!clients) return res.status(404).json({ message: "Client non trouvé" });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Vérifier si le client existe
        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Construire dynamiquement la requête SQL en fonction des champs fournis
        const fields = Object.keys(updates);
        if (fields.length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        const values = fields.map(field => updates[field]);
        const setClause = fields.map(field => `${field} = ?`).join(", ");

        // Exécuter la requête de mise à jour
        await pool.query(`UPDATE clients SET ${setClause} WHERE id = ?`, [...values, id]);

        res.status(200).json({ message: "Client mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.supprimerClient = async (req, res) => {
    try {
        const deleted = await Client.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Client non trouvé" });
        res.status(200).json({ message: "Client supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
