const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
    try {
        const prestataireId = req.user.id;
        if (!prestataireId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

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
        const { notificationId } = req.params;
        if (!notificationId) {
            return res.status(400).json({ message: 'ID de notification manquant' });
        }

        const result = await Notification.markAsRead(notificationId);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        
        res.status(200).json({ message: 'Notification marquée comme lue' });
    } catch (error) {
        console.error('Erreur lors du marquage de la notification:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
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
        const { notificationId } = req.params;
        const result = await Notification.delete(notificationId);
        
        if (result === 0) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }
        
        res.status(200).json({ message: 'Notification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}; 