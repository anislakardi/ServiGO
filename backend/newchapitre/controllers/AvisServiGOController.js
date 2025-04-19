const AvisServiGOModel = require("../models/AvisServiGOModel");

class AvisServiGOController {
    // Créer un nouvel avis
    static async createAvis(req, res) {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Vous devez être connecté pour donner votre avis" });
            }

            const clientId = req.user.id;
            
            // Vérifier si le client a déjà donné son avis
            const hasRated = await AvisServiGOModel.hasClientAlreadyRated(clientId);
            if (hasRated) {
                return res.status(400).json({ message: "Vous avez déjà donné votre avis" });
            }

            const avisData = {
                client_id: clientId,
                rating: req.body.rating,
                service_rating: req.body.service_rating,
                communication_rating: req.body.communication_rating,
                price_rating: req.body.price_rating,
                comment: req.body.comment
            };

            const avisId = await AvisServiGOModel.createAvis(avisData);
            res.status(201).json({ message: "Avis créé avec succès", id: avisId });
        } catch (error) {
            console.error("Erreur lors de la création de l'avis:", error);
            res.status(500).json({ message: "Erreur lors de la création de l'avis" });
        }
    }

    // Obtenir tous les avis
    static async getAllAvis(req, res) {
        try {
            const avis = await AvisServiGOModel.getAllAvis();
            res.json(avis);
        } catch (error) {
            console.error("Erreur lors de la récupération des avis:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des avis" });
        }
    }

    static async hasClientAlreadyRated(req, res) {
        try {
            const { id } = req.params;
            const avis = await AvisServiGOModel.hasClientAlreadyRated(id);
            res.json({ avis }); // <-- ici on retourne un objet avec clé "avis"
        } catch (error) {
            console.error("Erreur lors de la récupération des avis:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des avis" });
        }
    }

    // Obtenir les avis récents
    static async getRecentAvis(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const avis = await AvisServiGOModel.getRecentAvis(limit);
            res.json(avis);
        } catch (error) {
            console.error("Erreur lors de la récupération des avis récents:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des avis récents" });
        }
    }

    // Obtenir les statistiques globales
    static async getStats(req, res) {
        try {
            const stats = await AvisServiGOModel.getStats();
            res.json(stats);
        } catch (error) {
            console.error("Erreur lors de la récupération des statistiques:", error);
            res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
        }
    }

    // Mettre à jour un avis
    static async updateAvis(req, res) {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Vous devez être connecté pour modifier votre avis" });
            }

            const { id } = req.params;
            const clientId = req.user.id;

            const avisData = {
                rating: req.body.rating,
                service_rating: req.body.service_rating,
                communication_rating: req.body.communication_rating,
                price_rating: req.body.price_rating,
                comment: req.body.comment
            };

            const success = await AvisServiGOModel.updateAvis(id, avisData);
            if (success) {
                res.json({ message: "Avis mis à jour avec succès" });
            } else {
                res.status(404).json({ message: "Avis non trouvé" });
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avis:", error);
            res.status(500).json({ message: "Erreur lors de la mise à jour de l'avis" });
        }
    }

    // Supprimer un avis
    static async deleteAvis(req, res) {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Vous devez être connecté pour supprimer votre avis" });
            }

            const { id } = req.params;
            const clientId = req.user.id;

            const success = await AvisServiGOModel.deleteAvis(id);
            if (success) {
                res.json({ message: "Avis supprimé avec succès" });
            } else {
                res.status(404).json({ message: "Avis non trouvé" });
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'avis:", error);
            res.status(500).json({ message: "Erreur lors de la suppression de l'avis" });
        }
    }
}

module.exports = AvisServiGOController; 