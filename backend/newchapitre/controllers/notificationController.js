const Notification = require('../models/notificationModel');

const jwt = require('jsonwebtoken');

exports.getNotifications = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        const token = authHeader.split(' ')[1];
        let decoded;

        try {
            decoded = jwt.verify(token, 'votre_secret_key'); // 🔐 ton secret
        } catch (err) {
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }

        const prestataireId = decoded.userId; // ou decoded._id, selon comment tu signes ton token

        const notifications = await Notification.findByPrestataireId(prestataireId);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
};


exports.markAsRead = async (req, res) => {
    try {
        console.log('Début de markAsRead');
        const authHeader = req.headers.authorization;
        console.log('Headers:', req.headers);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Token manquant ou invalide');
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token reçu:', token.substring(0, 10) + '...');

        let decoded;
        try {
            decoded = jwt.verify(token, 'votre_secret_key');
            console.log('Token décodé:', decoded);
        } catch (err) {
            console.error('Erreur de vérification du token:', err);
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }

        const { notificationId } = req.params;
        console.log('Notification ID:', notificationId);
        
        if (!notificationId) {
            return res.status(400).json({ message: 'ID de notification manquant' });
        }

        const result = await Notification.markAsRead(notificationId);
        console.log('Résultat de la mise à jour:', result);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        
        res.status(200).json({ message: 'Notification marquée comme lue' });
    } catch (error) {
        console.error('Erreur détaillée dans markAsRead:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message,
            stack: error.stack
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const prestataireId = req.user.id;
        if (!prestataireId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const result = await Notification.markAllAsRead(prestataireId);
        res.status(200).json({ 
            message: 'Toutes les notifications marquées comme lues',
            count: result 
        });
    } catch (error) {
        console.error('Erreur lors du marquage des notifications:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const prestataireId = req.user.id;
        if (!prestataireId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        const count = await Notification.getUnreadCount(prestataireId);
        res.status(200).json({ count });
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        console.log('Début de deleteNotification');
        const authHeader = req.headers.authorization;
        console.log('Headers:', req.headers);
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Token manquant ou invalide');
            return res.status(401).json({ message: 'Token manquant ou invalide' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token reçu:', token.substring(0, 10) + '...');

        let decoded;
        try {
            decoded = jwt.verify(token, 'votre_secret_key');
            console.log('Token décodé:', decoded);
        } catch (err) {
            console.error('Erreur de vérification du token:', err);
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }

        const { notificationId } = req.params;
        console.log('Notification ID:', notificationId);
        
        if (!notificationId) {
            return res.status(400).json({ message: 'ID de notification manquant' });
        }

        const result = await Notification.delete(notificationId);
        console.log('Résultat de la suppression:', result);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        
        res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur détaillée dans deleteNotification:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message,
            stack: error.stack
        });
    }
}; 