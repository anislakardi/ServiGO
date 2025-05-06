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


        const formattedPrestataires = prestataires.map(prestataire => {
            if (prestataire.photo_de_profil) {
                // Vérifier si c'est déjà une chaîne base64
                if (typeof prestataire.photo_de_profil === 'string' && prestataire.photo_de_profil.startsWith('data:image')) {
                    // C'est déjà au format base64, ne rien faire
                } else {
                    // C'est un BLOB, convertir en base64
                    const base64Image = Buffer.from(prestataire.photo_de_profil).toString('base64');
                    prestataire.photo_de_profil = `data:image/jpeg;base64,${base64Image}`;
                }
            }
            if (prestataire.service1_photo) {
                // Vérifier si c'est déjà une chaîne base64
                if (typeof prestataire.service1_photo === 'string' && prestataire.service1_photo.startsWith('data:image')) {
                    // C'est déjà au format base64, ne rien faire
                } else {
                    // C'est un BLOB, convertir en base64
                    const base64Image = Buffer.from(prestataire.service1_photo).toString('base64');
                    prestataire.service1_photo = `data:image/jpeg;base64,${base64Image}`;
                }
            }
            if (prestataire.service2_photo) {
                // Vérifier si c'est déjà une chaîne base64
                if (typeof prestataire.service2_photo === 'string' && prestataire.service2_photo.startsWith('data:image')) {
                    // C'est déjà au format base64, ne rien faire
                } else {
                    // C'est un BLOB, convertir en base64
                    const base64Image = Buffer.from(prestataire.service2_photo).toString('base64');
                    prestataire.service2_photo = `data:image/jpeg;base64,${base64Image}`;
                }
            }
            return prestataire;
        });

        res.status(200).json(formattedPrestataires);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getPrestataireById = async (req, res) => {
    try {
        const prestataire = await Prestataire.findById(req.params.id);
        if (!prestataire) return res.status(404).json({ message: "Prestataire non trouvé" });

        if (prestataire.photo_de_profil) {
            // Vérifier si c'est déjà une chaîne base64
            if (typeof prestataire.photo_de_profil === 'string' && prestataire.photo_de_profil.startsWith('data:image')) {
                // C'est déjà au format base64, ne rien faire
            } else {
                // C'est un BLOB, convertir en base64
                const base64Image = Buffer.from(prestataire.photo_de_profil).toString('base64');
                prestataire.photo_de_profil = `data:image/jpeg;base64,${base64Image}`;
            }
        }
        if (prestataire.service1_photo) {
            // Vérifier si c'est déjà une chaîne base64
            if (typeof prestataire.service1_photo === 'string' && prestataire.service1_photo.startsWith('data:image')) {
                // C'est déjà au format base64, ne rien faire
            } else {
                // C'est un BLOB, convertir en base64
                const base64Image = Buffer.from(prestataire.service1_photo).toString('base64');
                prestataire.service1_photo = `data:image/jpeg;base64,${base64Image}`;
            }
        }
        if (prestataire.service2_photo) {
            // Vérifier si c'est déjà une chaîne base64
            if (typeof prestataire.service2_photo === 'string' && prestataire.service2_photo.startsWith('data:image')) {
                // C'est déjà au format base64, ne rien faire
            } else {
                // C'est un BLOB, convertir en base64
                const base64Image = Buffer.from(prestataire.service2_photo).toString('base64');
                prestataire.service2_photo = `data:image/jpeg;base64,${base64Image}`;
            }
        }
        res.status(200).json(prestataire);
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

exports.suspendrePrestataire = async (req, res) => {
    try {
        const { id } = req.params;
        const { jours_suspension } = req.body;  // Nombre de jours pendant lesquels le Prestataire sera suspendu

        // Vérifier si le Prestataire existe
        const existingPrestataire = await Prestataire.findById(id);
        if (!existingPrestataire) {
            return res.status(404).json({ message: "Prestataire non trouvé" });
        }

        // Calculer la date de suspension
        const dateSuspension = new Date();
        dateSuspension.setDate(dateSuspension.getDate() + jours_suspension);  // Suspension pour X jours

        // Suspendre le Prestataire
        const result = await Prestataire.suspend(id, dateSuspension);
        if (result === 0) {
            return res.status(400).json({ message: "Erreur lors de la suspension du Prestataire" });
        }

        res.status(200).json({ message: "Prestataire suspendu avec succès jusqu'au " + dateSuspension.toISOString().split('T')[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suspension du Prestataire', error });
    }
};

exports.reactiverPrestataire = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le Prestataire existe
        const existingPrestataire = await Prestataire.findById(id);
        if (!existingPrestataire) {
            return res.status(404).json({ message: "Prestataire non trouvé" });
        }

        // Réactiver le Prestataire (réinitialisation du champ suspendu_jusqu à NULL)
        const result = await Prestataire.activate(id);
        if (result === 0) {
            return res.status(400).json({ message: "Erreur lors de la réactivation du Prestataire" });
        }

        res.status(200).json({ message: "Prestataire réactivé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la réactivation du Prestataire', error });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['disponible', 'occupé'].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        const result = await Prestataire.updateStatus(id, status);
        if (result === 0) {
            return res.status(404).json({ message: "Prestataire non trouvé" });
        }

        res.status(200).json({ message: "Statut mis à jour avec succès", status });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await Prestataire.getStatus(id);
        res.status(200).json({ status });
    } catch (error) {
        console.error("Erreur lors de la récupération du statut:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getServicePhotos = async (req, res) => {
    try {
      const { id } = req.params;
  
      const servicePhotos = await Prestataire.getServicePhotos(id);
  
      if (!servicePhotos) {
        return res.status(404).json({
          success: false,
          message: "Prestataire non trouvé"
        });
      }
  
      res.status(200).json({
        success: true,
        servicePhotos
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des photos de services:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des photos de services",
        error: error.message
      });
    }
  };
  
  exports.postServicePhoto = async (req, res) => {
    try {
      const { id } = req.params; // ou req.user.id si authentifié
      const { serviceNumber, photo, mediaType } = req.body;
  
      if (!photo||!mediaType||!serviceNumber||serviceNumber < 1||serviceNumber > 3) {
        return res.status(400).json({ message: "Données invalides" });
      }
  
      const result = await Prestataire.updateServicePhoto(id, serviceNumber, photo, mediaType);
  
      if (result === 0) {
        return res.status(404).json({ message: "Prestataire non trouvé" });
      }
  
      res.status(200).json({ 
        message: "Photo de service ajoutée avec succès",
        serviceNumber,
        photo,
        mediaType
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo de service:", error);
      res.status(500).json({ message: "Erreur interne" });
    }
  };
  
  
  exports.deleteServicePhoto = async (req, res) => {
    try {
      const { id } = req.params;
      const { serviceNumber } = req.params;
  
      if (!serviceNumber||serviceNumber < 1 || serviceNumber > 3) {
        return res.status(400).json({ message: "Numéro de service invalide" });
      }
  
      const result = await Prestataire.deleteServicePhoto(id, serviceNumber);
      
      if (result === 0) {
        return res.status(404).json({ message: "Photo de service non trouvée" });
      }
  
      res.status(200).json({ 
        message: "Photo de service supprimée avec succès",
        serviceNumber
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo de service:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  };

