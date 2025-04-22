const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");

exports.create = async (req, res) => {
    try {
        const { conversation_id, sender_client_id, sender_prestataire_id, description, photos } = req.body;

        if (!conversation_id || (!description && !photos)) {
            return res.status(400).json({ message: "Le message doit contenir une description ou une photo" });
        }

        // Déterminer l'expéditeur
        const sender_id = sender_client_id || sender_prestataire_id;
        if (!sender_id) {
            return res.status(400).json({ message: "L'expéditeur est requis" });
        }

        // Vérifier si l'expéditeur appartient bien à la conversation
        const isParticipant = await Conversation.isParticipant(conversation_id, sender_id);
        if (!isParticipant) {
            return res.status(403).json({ message: "Vous ne faites pas partie de cette conversation" });
        }

        // Insérer le message
        const messageId = await Message.create({
            conversation_id,
            sender_client_id,
            sender_prestataire_id,
            description: description || null,
            photos: photos ? Buffer.from(photos, 'base64') : null
        });

        res.status(201).json({ message: "Message envoyé", messageId });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getByConversation = async (req, res) => {
    try {
        const { conversation_id } = req.params;
        const messages = await Message.findByConversation(conversation_id);

        const messagesWithMedia = messages.map(msg => {
            const plainMsg = msg.dataValues || msg; // Sequelize ou non
        
            return {
                ...plainMsg,
                photos: plainMsg.photos ? Buffer.from(plainMsg.photos).toString('base64') : null,
            };
        });
        res.json(messagesWithMedia);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { message_id } = req.params;
        const message = await Message.findById(message_id); // Récupère un seul message
        // C'est déjà un objet, pas besoin de message[0]

        if (!message) {
            return res.status(404).json({ message: "Message non trouvé" });
        }

        // Conversion de photos en base64 si présentes
        const messageWithMedia = {
            ...message,
            photos: message.photos ? Buffer.from(message.photos).toString('base64') : null
        };

        res.json(messageWithMedia); // Envoie le message avec les photos converties en base64
    } catch (error) {
        console.error("Erreur dans getById:", error);
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
