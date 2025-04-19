const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");

// Créer une conversation avec un titre
exports.create = async (req, res) => {
    try {
        const { client_id, prestataire_id, titre } = req.body;
        if (!client_id || !prestataire_id || !titre) {
            return res.status(400).json({ message: "Client, prestataire et titre requis" });
        }

        // Vérifier si une conversation existe déjà entre ces deux utilisateurs
        const existingConversation = await Conversation.findExisting(client_id, prestataire_id);
        if (existingConversation) {
            return res.status(200).json({ message: "Conversation existante", conversation: existingConversation });
        }

        // Créer une nouvelle conversation
        const conversationId = await Conversation.create({ client_id, prestataire_id, titre });
        res.status(201).json({ message: "Nouvelle conversation créée", conversationId });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


// Récupérer les conversations d'un client
exports.getByClient = async (req, res) => {
    try {
        const { client_id } = req.params;
        const conversations = await Conversation.findByClient(client_id);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Récupérer les conversations avec publications d'un client
exports.getConversationsWithPublications = async (req, res) => {
    try {
        const { client_id } = req.params;
        console.log("Requête reçue pour les conversations du client:", client_id);

        const conversations = await Conversation.findByClient(client_id);
        console.log("Conversations trouvées:", conversations);

        res.json({
            success: true,
            data: conversations
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des conversations:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des conversations",
            error: error.message
        });
    }
};

// Récupérer les conversations d'un prestataire
exports.getByPrestataire = async (req, res) => {
    try {
        const { prestataire_id } = req.params;
        const conversations = await Conversation.findByPrestataire(prestataire_id);
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Récupérer une conversation par ID
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation non trouvée" });
        }
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Mettre à jour le titre d'une conversation
exports.updateTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { titre } = req.body;
        if (!titre) {
            return res.status(400).json({ message: "Le titre est requis" });
        }

        const updatedRows = await Conversation.updateTitle(id, titre);
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Conversation non trouvée" });
        }

        res.json({ message: "Titre mis à jour" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Supprimer une conversation
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Conversation.delete(id);
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Conversation non trouvée" });
        }
        res.json({ message: "Conversation supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
