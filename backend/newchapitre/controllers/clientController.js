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
        
        // Convertir les BLOB en base64 pour chaque client
        const formattedClients = clients.map(client => {
            if (client.photo_de_profil) {
                // Vérifier si c'est déjà une chaîne base64
                if (typeof client.photo_de_profil === 'string' && client.photo_de_profil.startsWith('data:image')) {
                    // C'est déjà au format base64, ne rien faire
                } else {
                    // C'est un BLOB, convertir en base64
                    const base64Image = Buffer.from(client.photo_de_profil).toString('base64');
                    client.photo_de_profil = `data:image/jpeg;base64,${base64Image}`;
                }
            }
            return client;
        });
        
        res.status(200).json(formattedClients);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: "Client non trouvé" });
        
        // Convertir le BLOB en base64 si la photo existe
        if (client.photo_de_profil) {
            // Vérifier si c'est déjà une chaîne base64
            if (typeof client.photo_de_profil === 'string' && client.photo_de_profil.startsWith('data:image')) {
                // C'est déjà au format base64, ne rien faire
            } else {
                // C'est un BLOB, convertir en base64
                const base64Image = Buffer.from(client.photo_de_profil).toString('base64');
                client.photo_de_profil = `data:image/jpeg;base64,${base64Image}`;
            }
        }
        
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getClientByUsername = async (req, res) => {
    try {
      const client = await Client.findByUsername(req.params.username);
      if (!client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      res.status(200).json(client);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
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

exports.suspendreClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { jours_suspension } = req.body;  // Nombre de jours pendant lesquels le client sera suspendu

        // Vérifier si le client existe
        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Calculer la date de suspension
        const dateSuspension = new Date();
        dateSuspension.setDate(dateSuspension.getDate() + jours_suspension);  // Suspension pour X jours

        // Suspendre le client
        const result = await Client.suspend(id, dateSuspension);
        if (result === 0) {
            return res.status(400).json({ message: "Erreur lors de la suspension du client" });
        }

        res.status(200).json({ message: "Client suspendu avec succès jusqu'au " + dateSuspension.toISOString().split('T')[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suspension du client', error });
    }
};

exports.reactiverClient = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le client existe
        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Réactiver le client (réinitialisation du champ suspendu_jusqu à NULL)
        const result = await Client.activate(id);
        if (result === 0) {
            return res.status(400).json({ message: "Erreur lors de la réactivation du client" });
        }

        res.status(200).json({ message: "Client réactivé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la réactivation du client', error });
    }
};


exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        const { photo_de_profil } = req.body;

        // Vérifier si le client existe
        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return res.status(404).json({ message: "Client non trouvé" });
        }

        // Vérifier si la photo est fournie
        if (!photo_de_profil) {
            return res.status(400).json({ message: "La photo de profil est requise" });
        }

        // Vérifier si la photo est au format base64
        if (!photo_de_profil.startsWith('data:image')) {
            return res.status(400).json({ message: "Format de photo invalide. Veuillez fournir une image au format base64" });
        }

        // Extraire les données base64 sans le préfixe "data:image/jpeg;base64,"
        const base64Data = photo_de_profil.replace(/^data:image\/\w+;base64,/, '');
        
        // Convertir en Buffer (BLOB)
        const buffer = Buffer.from(base64Data, 'base64');

        // Mettre à jour uniquement la photo de profil
        await pool.query(
            'UPDATE clients SET photo_de_profil = ? WHERE id = ?',
            [buffer, id]
        );

        res.status(200).json({ 
            message: "Photo de profil mise à jour avec succès"
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la photo de profil:', error);
        res.status(500).json({ 
            message: "Erreur lors de la mise à jour de la photo de profil", 
            error: error.message 
        });
    }
};
