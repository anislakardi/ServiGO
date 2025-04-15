const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

exports.create = async (req, res) => {
    try {
        const { conversation_id, sender_client_id, sender_prestataire_id, description, photos } = req.body;

        if (!conversation_id || !description) {
            return res.status(400).json({ message: "conversation_id et description sont requis" });
        }

        // Déterminer l'expéditeur
        const sender_id = sender_client_id || sender_prestataire_id;
        if (!sender_id) {
            return res.status(400).json({ message: "L'expéditeur est requis" });
        }

        console.log("Vérification de l'expéditeur :", sender_id, "dans la conversation", conversation_id); // 🔍 Debug

        // Vérifier si l'expéditeur appartient bien à la conversation
        const isParticipant = await Conversation.isParticipant(conversation_id, sender_id);
        if (!isParticipant) {
            console.log("⚠️ L'utilisateur n'est pas autorisé !"); // 🔍 Debug
            return res.status(403).json({ message: "Vous ne faites pas partie de cette conversation" });
        }

        console.log("✅ L'utilisateur est autorisé à envoyer un message !"); // 🔍 Debug

        // Insérer le message
        const messageId = await Message.create({ conversation_id, sender_client_id, sender_prestataire_id, description, photos });
        res.status(201).json({ message: "Message envoyé", messageId });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getByConversation = async (req, res) => {
    try {
        const { conversation_id } = req.params;
        const messages = await Message.findByConversation(conversation_id);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRows = await Message.markAsRead(id);
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Message non trouvé" });
        }
        res.json({ message: "Message marqué comme lu" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Message.delete(id);
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Message non trouvé" });
        }
        res.json({ message: "Message supprimé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
