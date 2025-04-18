const Publication = require("../models/publicationModel");
const pool = require('../config/database');

// ✅ Ajouter une publication
exports.ajouterPublication = async (req, res) => {
    try {
        const { titre, description, adresse, date_execution, service_vise, budget, client_id, media } = req.body;
        
        // Vérifier si les champs requis sont présents
        if (!titre || !description || !service_vise || !client_id) {
            return res.status(400).json({ 
                message: "Champs requis manquants", 
                details: {
                    titre: !titre ? "Le titre est requis" : null,
                    description: !description ? "La description est requise" : null,
                    service_vise: !service_vise ? "Le service visé est requis" : null,
                    client_id: !client_id ? "L'ID du client est requis" : null
                }
            });
        }
        
        const publicationId = await Publication.create({ titre, description, adresse, date_execution, service_vise, budget, client_id, media });
        res.status(201).json({ message: "Publication ajoutée avec succès", publicationId });
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une publication:", error);
        res.status(500).json({ 
            message: "Erreur serveur lors de l'ajout de la publication", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ✅ Récupérer toutes les publications
exports.getAllPublications = async (req, res) => {
    try {
        const [publications] = await pool.query(`
            SELECT p.*, c.nom_utilisateur, c.nom, c.prenom, c.photo_de_profil, p.adresse
            FROM client_publication p 
            JOIN clients c ON p.client_id = c.id 
            ORDER BY p.date_publication DESC
        `);

        if (!publications || publications.length === 0) {
            return res.status(200).json([]);
        }

        // Convertir les données binaires des médias et photos de profil en base64
        const publicationsWithMedia = publications.map(pub => ({
            ...pub,
            media: pub.media ? Buffer.from(pub.media).toString('base64') : null,
            photo_de_profil: pub.photo_de_profil ? Buffer.from(pub.photo_de_profil).toString('base64') : null
        }));

        res.status(200).json(publicationsWithMedia);
    } catch (error) {
        console.error('Erreur lors de la récupération des publications:', error);
        res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message,
            details: error
        });
    }
};

// ✅ Récupérer les publications par service
exports.getPublicationsByService = async (req, res) => {
    try {
        const { service } = req.params;
        const publications = await Publication.findByService(service);
        res.json(publications);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ✅ Récupérer les publications par statut
exports.getPublicationsByStatus = async (req, res) => {
    try {
        const { statut } = req.params;
        const publications = await Publication.findByStatus(statut);
        res.json(publications);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getPublicationByClient = async (req, res) => {
  try {
      const clientId = parseInt(req.params.client_id, 10);

      if (isNaN(clientId)) {
          return res.status(400).json({ message: "ID client invalide" });
      }

      const publications = await Publication.findByIdClient(clientId);

      // Retourner un tableau vide au lieu d'une erreur 404
      res.json(publications);
  } catch (error) {
      console.error('Erreur lors de la récupération des publications du client:', error);
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Modifier une publication
exports.modifierPublication = async (req, res) => {
  try {
      const { id } = req.params;
      const { titre, description, adresse, date_execution, budget, statut } = req.body;

      // Récupérer la publication existante
      const publication = await Publication.findById(id);
      if (!publication) {
          return res.status(404).json({ message: "Publication non trouvée" });
      }

      // Garder les anciennes valeurs si un champ est absent dans la requête
      const updatedPublication = {
          titre: titre ?? publication.titre,
          description: description ?? publication.description,
          adresse: adresse ?? publication.adresse,
          budget: budget ?? publication.budget,
          date_execution: date_execution ?? publication.date_execution,
          statut: statut ?? publication.statut
      };

      // Mise à jour de la publication
      const updatedRows = await Publication.update(id, updatedPublication);
      if (updatedRows === 0) {
          return res.status(404).json({ message: "Échec de la mise à jour" });
      }

      res.status(200).json({ message: "Publication modifiée avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Mettre une publication en pause (Changer son statut)
exports.pausePublication = async (req, res) => {
  try {
      const { id } = req.params;

      // Récupérer la publication existante
      const publication = await Publication.findById(id);
      if (!publication) {
          return res.status(404).json({ message: "Publication non trouvée" });
      }

      // Mettre à jour uniquement le statut
      const updatedRows = await Publication.update(id, {
          titre: publication.titre,
          description: publication.description,
          adresse: publication.adresse,
          budget: budget ?? publication.budget,
          date_execution: publication.date_execution,
          statut: "En attente"
      });

      if (updatedRows === 0) {
          return res.status(404).json({ message: "Échec de la mise à jour" });
      }

      res.status(200).json({ message: "Publication mise en pause avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ✅ Supprimer une publication
exports.supprimerPublication = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Publication.delete(id);
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Publication non trouvée" });
        }

        res.status(200).json({ message: "Publication supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
