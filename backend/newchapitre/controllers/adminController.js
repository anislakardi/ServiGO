const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // Assure-toi que le chemin est correct

exports.createAdmin = async (req, res) => {
  try {
      const { nom, prenom, email, mot_de_passe, pin } = req.body;

      // Vérifier si l'email existe déjà
      const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);

      if (rows.length > 0) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

      await pool.query(
        `INSERT INTO admins (nom, prenom, email, mot_de_passe, pin) 
        VALUES (?, ?, ?, ?, ?)`, 
        [nom, prenom, email, hashedPassword, pin]
      );

      res.status(201).json({ message: 'Admin créé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la création de l\'admin', error });
  }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const [admins] = await pool.query('SELECT * FROM admins');
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const [admin] = await pool.query('SELECT * FROM admins WHERE id = ?', [req.params.id]);
        if (admin.length === 0) return res.status(404).json({ message: "Admin non trouvé" });
        res.status(200).json(admin[0]);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Vérifier si l'admin existe
        const [existingAdmin] = await pool.query('SELECT * FROM admins WHERE id = ?', [id]);
        if (existingAdmin.length === 0) {
            return res.status(404).json({ message: "Admin non trouvé" });
        }

        // Construire dynamiquement la requête SQL en fonction des champs fournis
        const fields = Object.keys(updates);
        if (fields.length === 0) {
            return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
        }

        const values = fields.map(field => updates[field]);
        const setClause = fields.map(field => `${field} = ?`).join(", ");

        // Exécuter la requête de mise à jour
        await pool.query(`UPDATE admins SET ${setClause} WHERE id = ?`, [...values, id]);

        res.status(200).json({ message: "Admin mis à jour avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.supprimerAdmin = async (req, res) => {
    try {
        const [deleted] = await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
        if (deleted.affectedRows === 0) return res.status(404).json({ message: "Admin non trouvé" });
        res.status(200).json({ message: "Admin supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
